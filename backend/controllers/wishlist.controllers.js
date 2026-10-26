
import Product from '../models/product.model.js'
import Customer from '../models/customer.model.js'
import mongoose from 'mongoose';

export const addToWishlist = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id;
    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Safety fallback for existing documents where wishlist was undefined
    const wishlist = customer.wishlist || [];

    // Check if product is already added
    const alreadyExists = wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(409).json({ message: 'Already in wishlist' });
    }

    // Initialize array on customer document if needed & push product
    if (!customer.wishlist) {
      customer.wishlist = [];
    }
    customer.wishlist.push(productId);

    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


export const getWishlist = async (req, res) => {
    try {
        const customerId = req.customer?._id;
        if (!customerId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const customer = await Customer.findById(customerId).populate({ path: "wishlist", select: "name price category image stock" })
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }
        return res.status(200).json({
            success: true,
            wishlist: customer.wishlist
        })

    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}

export const deleteProductFromWishlist = async (req, res) => {
    try {
        const customerId = req.customer?._id;
        if (!customerId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }
        const productIndex = customer.wishlist.findIndex((id) => id.toString() === productId)
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not on wishlist' })
        }
        customer.wishlist.splice(productIndex, 1)
        await customer.save();
        return res.status(200).json({ success: true, message: 'Product removed from wishlist' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}


