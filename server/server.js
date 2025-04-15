import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';



const app = express();
const port = process.env.PORT || 4000;


await connectDB();

// Allow multiple origins
const allowdOrigins = [
  'http://localhost:5173']


// Midldleware congiguration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowdOrigins, Credential: true}));

app.get('/', (req, res) => res.send('Api is Working!'));
app.use('/api/user', userRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost: ${port}`);
});