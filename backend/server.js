import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";
import filmsRoutes from "./routes/films.js";
import {identifyUser} from "./middleware/identityCheck.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(identifyUser);

app.use("/auth", authRoutes);
app.use("/films", filmsRoutes);

app.get("/health", (req, res) => {
    res.json({ message: "Server is running!" });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});