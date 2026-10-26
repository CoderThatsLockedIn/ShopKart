import express from 'express'

import {addToWishlist, getWishlist, deleteProductFromWishlist} from '../controllers/wishlist.controllers.js'

import isAuthenticated from '../middlewares/authMiddleware.js'

const wishlistRoutes = express.Router();

wishlistRoutes.post('/:productId', isAuthenticated, addToWishlist)

wishlistRoutes.get('/', isAuthenticated, getWishlist)

wishlistRoutes.delete('/:productId', isAuthenticated, deleteProductFromWishlist)

export default wishlistRoutes;