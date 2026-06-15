import db from "../models/db/index.js";
import {recommendations, films, rating} from "../models/db/schema.js";
import {eq, and, desc} from "drizzle-orm";
import {fetchFilmsByGenre, fetchFilmById, getGenreId, GENRE_MAP} from "./services/tmdb.js";

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

export const filmRating = async (userId, filmTmdbId, score) => {
    if (!score || score < 1 || score > 5) {
        return { message: 'Score must be between 1 and 5' };
    }
    const [filmExisted] = await db.select().from(films).where(eq(films.tmdbId, filmTmdbId));
    if(!filmExisted){
        return { message: 'Film not found' };
    }

    try{
        await db.insert(rating).values({
            userId,
            filmId: filmTmdbId,
            score,
        }).onConflictDoUpdate({
            target: [rating.userId, rating.filmId],
            set: { score, ratedAt: new Date() },
        });
        return { message: 'Rating saved successfully' };
    } catch (error) {
        console.error('Error saving rating:', error);
        return { message: 'Internal server error' };
    }
}

export const getFilmHistory = async(userId, page = 1 , limit = 20) =>{
    try{
        const offset = (page - 1) * limit;
        const filmHistory =  await db
            .select({
                recommendedAt: recommendations.recommendedAt,
                title: films.title,
                posterUrl: films.posterUrl,
                releaseYear: films.releaseYear,
                tmdbId: films.tmdbId,
                score: rating.score,
            })
            .from(recommendations)
            .innerJoin(films, eq(recommendations.filmTmdbId, films.tmdbId))
            .leftJoin(rating, and(
                eq(rating.filmId, films.tmdbId),
                eq(rating.userId, userId)
            ))
            .where(eq(recommendations.userId, userId))
            .orderBy(desc(recommendations.recommendedAt))
            .limit(limit)
            .offset(offset)
            return {history: filmHistory};
    }
    catch (error) {
        console.error('Error fetching film history:', error);
        return { message: 'Internal server error' };
    }
}