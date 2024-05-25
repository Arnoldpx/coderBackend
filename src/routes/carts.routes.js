import express from 'express';
import cartManager from '../cartManager.js';

const router = express.Router();
// Ruta para obtener un carrito por su ID
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(parseInt(req.params.cid));
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para añadir un producto a un carrito
router.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para crear un nuevo carrito
router.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;