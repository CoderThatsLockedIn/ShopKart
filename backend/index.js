import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose'
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js'
import cartRoutes from './routes/cart.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 8082
mongoose.connect(process.env.dbURL).then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/customer', customerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})