import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
dotenv.config({ quiet: true });

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'localhost:5173',
    credentials: true
}))


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
