import express from 'express';
import { PORT } from './config/env.js'; 
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';   
import { connect } from 'mongoose';
import mongoose from 'mongoose';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cookieParser()  
)
app.use(arcjetMiddleware);


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);


// webpage message
app.get('/', (req, res) => {
    res.send('Welcome to the subscription tracker api!');
});    

// command line message
app.listen(PORT, async () => {    
    console.log(`Subscription tracking api is running on localhost:${PORT}`);

    await connectToDatabase();
});

export default app;