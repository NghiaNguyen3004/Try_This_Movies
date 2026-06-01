import express from "express";
import db from "../models/db/index.js";
import {recommendations, films} from "../models/db/schema.js";
import {eq, and} from "drizzle-orm";
import {fetchFilmsByGenre, fetchFilmById, getGenreId, GENRE_MAP} from "../models/services/tmdb.js";
import {requireAuth} from "../middleware/identityCheck.js";

const filmsRoutes = express.Router();

// Get /films/genres - Get list of available genres
filmsRoutes.get('/genres', (req, res) => {
    const genres = Object.keys(GENRE_MAP).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: name,
    }))
    res.json({ genres })
})

// Get /films/recommendations?genres=? - Get film recommendations based on genres
filmsRoutes.get('/recommend', async (req, res) => {
    console.log('Full query object:', req.query)
    console.log('All keys:', Object.keys(req.query))
    console.log('Genre:', req.query.genre)
    console.log('Type:', typeof req.query.genre)

    const genre = req.query.genre;
    if (!genre){
        return res.status(400).json({ message: 'Genres query parameter is required' });
    } 
    
    const genreNames = Array.isArray(genre) ? genre : [genre]; // Handle both single and multiple genres

    try{
        //fetch films from TMDB
        let films = await fetchFilmsByGenre(genreNames);
        // If guest, filter out films that have been recommended in this session
        if(req.guest){
            const seen = await db
            .select({ filmTmdbId: recommendations.filmTmdbId })
                        .from(recommendations)
                        .where(eq(recommendations.guestId, req.guest.guestId));
            const seenIds = seen.map(s => s.filmTmdbId);
            films = films.filter(f=> !seenIds.includes(f.tmdbId));
        }
        // If user, filter out films that have been recommended to this user
        if(req.user){
            const seen = await db
            .select({ filmTmdbId: recommendations.filmTmdbId })
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.userId));
            const seenIds = seen.map(s => s.filmTmdbId);
            films = films.filter(f => !seenIds.includes(f.tmdbId));
        }

        // Pick the first film from the filtered list
        const recommendation = films[0];
        if(!recommendation){
            return res.status(404).json({ message: 'No more recommendations available for the selected genres' });
        }
        // Save recommendation to DB for tracking
        await db.insert(recommendations).values({
            userId: req.user ? req.user.userId : null,
            guestId: req.guest ? req.guest.id : null,
            filmTmdbId: recommendation.tmdbId,
            genreSearched:[genre],
        });
        res.json({ film: recommendation });
    } catch (error) {
        console.error('Error fetching film recommendations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default filmsRoutes;
