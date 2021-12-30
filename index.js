import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import postsRoute from './routes/posts.js';
import userRoute from './routes/users.js';

const app = express();
app.use(express.json({ limit: 3000000 }));
app.use(cors());

//Middlewares
app.use('/posts', postsRoute)
app.use('/user', userRoute)

app.get('/', (req,res)=>{
    res.send('Welcome to Instaverse API')
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONN_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> app.listen(PORT, console.log(`Server running on port: ${PORT}`)))
.catch(err => console.log(err.message))

