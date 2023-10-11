import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from 'cors';
import path from 'path'

// import all the routes related to authentication from authRoute.js file
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
// configure env
dotenv.config();

// database config
connectDB();

// creating rest object to create APIs
const app = express()

// middlewares 
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))


// routes 
// route for authenication : 
app.use('/api/v1/auth', authRoutes);
// route for categories : 
app.use('/api/v1/category', categoryRoutes)
// route for products : 
app.use('/api/v1/product', productRoutes)


// basic route for home page | rest api
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

// PORT 
const PORT = process.env.PORT || 8080;

// run / listen app
app.listen(PORT, () => {
    console.log(`Server`)
})