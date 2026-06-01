import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";
import filmsRoutes from "./routes/films.js";
import {identifyUser} from "./middleware/identityCheck.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

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