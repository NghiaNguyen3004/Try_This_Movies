import express from "express";

import {requireAuth, identifyUser} from "../middleware/identityCheck.js";
import {getFilmRecommendationController} from "../controller/filmRecommendController.js";
import {rateFilmController} from "../controller/filmRatingController.js";
import {GENRE_MAP} from "../models/services/tmdb.js";

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
filmsRoutes.get('/recommend', getFilmRecommendationController);

// POST /films/rate - Submit a rating for a film
filmsRoutes.post('/rate', requireAuth, rateFilmController);

export default filmsRoutes;
