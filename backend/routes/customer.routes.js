import express from 'express';
import {registerCustomer, loginCustomer, getCustomer, logoutCustomer} from '../controllers/customer.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js';
const customerRoutes = express.Router();

customerRoutes.post('/register', registerCustomer);


customerRoutes.post('/login', loginCustomer);

customerRoutes.get('/me', isAuthenticated, getCustomer);

customerRoutes.post('/logout', logoutCustomer);
export default customerRoutes;