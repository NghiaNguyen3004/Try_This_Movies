import db from "../models/db/index.js";
import {recommendations, films} from "../models/db/schema.js";
import {eq, and} from "drizzle-orm";
import {fetchFilmsByGenre, fetchFilmById, getGenreId, GENRE_MAP} from "../models/services/tmdb.js";

export const filmRecommendations = async (userId, guestId, genres) => {

    if (!genres){
        return { message: 'Genres query parameter is required' };
    } 
    
    const genreNames = Array.isArray(genres) ? genres : [genres]; // Handle both single and multiple genres

    try{
        //fetch films from TMDB
        let filmsResult = await fetchFilmsByGenre(genreNames);
        // If guest, filter out films that have been recommended in this session
        if(guestId){
            const seen = await db
            .select({ filmTmdbId: recommendations.filmTmdbId })
                        .from(recommendations)
                        .where(eq(recommendations.guestId, guestId));
            const seenIds = seen.map(s => s.filmTmdbId);
            filmsResult = filmsResult.filter(f=> !seenIds.includes(f.tmdbId));
        }
        // If user, filter out films that have been recommended to this user
        if(userId){
            const seen = await db
            .select({ filmTmdbId: recommendations.filmTmdbId })
            .from(recommendations)
            .where(eq(recommendations.userId, userId));
            const seenIds = seen.map(s => s.filmTmdbId);
            filmsResult = filmsResult.filter(f => !seenIds.includes(f.tmdbId));
        }

        // Pick the first film from the filtered list
        const recommendation = filmsResult[0];
        if(!recommendation){
            return { message: 'No more recommendations available for the selected genres' };
        }

        await db.insert(films).values({
            tmdbId: recommendation.tmdbId,
            title: recommendation.title,
            genre: recommendation.genre.map(String),
            releaseYear: recommendation.releaseYear,
            posterUrl: recommendation.posterUrl,
            description: recommendation.description,
        }).onConflictDoNothing();
        
        // Save recommendation to DB for tracking
        await db.insert(recommendations).values({
            userId: userId,
            guestId: guestId,
            filmTmdbId: recommendation.tmdbId,
            genreSearched: genreNames,
        });
        return { film: recommendation };
    } catch (error) {
        console.error('Error fetching film recommendations:', error);
        return { message: 'Internal server error' };
    }
}