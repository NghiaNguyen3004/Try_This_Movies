import {getFilmHistory} from "../models/filmModel.js";

export const getFilmHistoryController = async (req, res) => {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await getFilmHistory(userId, page, limit);
    if (result.message) {
        return res.status(500).json({ message: result.message });
    }
    return res.status(200).json(result);
}