import Product from '../models/product.model.js';

// POST /products
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const numPrice = Number(price);
        const numStock = Number(stock);

        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({ message: 'Invalid price' });
        }

        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({ message: 'Invalid stock' });
        }

        const newProduct = await Product.create({
            name: String(name).trim(),
            description: String(description).trim(),
            price: numPrice,
            category: String(category).trim(),
            image: String(image).trim(),
            stock: numStock
        });

        return res.status(201).json(newProduct);
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        let allProducts = await Product.find({});
        const { search, category } = req.query;

        // Fixed: Removed '!' so filtering runs ONLY when search/category parameters exist
        if (search?.trim()) {
            allProducts = allProducts.filter((product) => 
                product.name.toLowerCase().includes(search.trim().toLowerCase())
            );
        }

        if (category?.trim() && category !== 'All Categories') {
            allProducts = allProducts.filter((product) => 
                product.category.toLowerCase().includes(category.trim().toLowerCase())
            );
        }

        return res.status(200).json({
            success: true,
            count: allProducts.length,
            products: allProducts
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId?.trim()) {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};