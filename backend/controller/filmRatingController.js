import {filmRating} from "../models/filmModel.js";

export const rateFilmController = async (req, res) => {
    const userId = req.user ? req.user.userId : null;
    const filmTmdbId = req.body.filmTmdbId;
    const score = req.body.score;
    if (!filmTmdbId || !score){
        return res.status(400).json({ message: 'filmTmdbId and score are required' });
    }

    const result = await filmRating(userId, filmTmdbId, score);
    if(result.message){
        return res.status(200).json({ message: result.message });
    }
    return res.json({ message: 'Rating submitted successfully' });
}