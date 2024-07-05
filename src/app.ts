import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import movieRoutes from './routes/movies';
import userRoutes from './routes/users';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

export default app;
