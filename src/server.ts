import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies';
import userRoutes from './routes/users';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.log(err));
