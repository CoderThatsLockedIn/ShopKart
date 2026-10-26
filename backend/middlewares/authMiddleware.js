import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401)  .json({message: 'Unauthorized'});
        }
        const decoded = jwt.verify(token, process.env.jwt_secret);
        const customerId = decoded._id || decoded.id || decoded.userId;
        const customer = await Customer.findById(customerId).select('-password');

        if (!customer) {
            return res.status(404).json({message: 'Customer not found'});
        }
        req.customer = customer;
        next();
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Invalid or expired token'});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
}
export default isAuthenticated;