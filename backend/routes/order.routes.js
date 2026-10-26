import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} from '../controllers/order.controllers.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.use(isAuthenticated);

orderRoutes.post('/create-payment-order', createPaymentOrder);
orderRoutes.post('/verify-payment', verifyPayment);
orderRoutes.get('/', getMyOrders);
orderRoutes.get('/:id', getOrderById);

export default orderRoutes;