import {filmRecommendations} from '../models/filmModel.js';

export const getFilmRecommendationController = async (req, res) => {
    const userId = req.user ? req.user.userId : null;
    const guestId = req.guest ? req.guest.id : null;
    const genres = req.query.genre;
    const result = await filmRecommendations(userId, guestId, genres);
    return res.json(result);
}