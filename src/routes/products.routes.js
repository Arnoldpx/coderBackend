import  express from 'express';
import productManager from '../productManager.js';


const router = express.Router();
// Ruta para obtener todos los productos
router.get('/products', async (req, res) => {
    try {
        await productManager.init();
        const products = productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producto por su ID
router.get('/products/:pid', async (req, res) => {
    try {
        await productManager.init();
        const product = productManager.getProductById(parseInt(req.params.pid));
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para añadir un nuevo producto
router.post('/products', async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.status(201).json({ message: 'Producto añadido exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto existente
router.put('/products/:pid', async (req, res) => {
    try {
        await productManager.updateProduct(parseInt(req.params.pid), req.body);
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto
router.delete('/products/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid));
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

export default router;