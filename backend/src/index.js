import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// ── Route imports ─────────────────────────────────────────────
import trainRoutes    from './routes/train.routes.js'
import routeRoutes    from './routes/route.routes.js'
import journeyRoutes  from './routes/journey.routes.js'
import carriageRoutes from './routes/carriage.routes.js'
import seatRoutes     from './routes/seat.routes.js'

const app = express();
dotenv.config({ quiet: true });

// ── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/trains',    trainRoutes);
app.use('/api/routes',    routeRoutes);
app.use('/api/journeys',  journeyRoutes);
app.use('/api/carriages', carriageRoutes);
app.use('/api/seats',     seatRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});