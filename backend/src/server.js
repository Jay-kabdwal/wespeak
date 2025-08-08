import express from "express";
import "dotenv/config";
import { dbConnect } from './lib/dbconnect.js';
import authRoutes from "./routes/auth.route.js";

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Connect to DB first, then start server
dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to connect to DB:", err);
        process.exit(1); // Exit the process if DB connection fails
    });
