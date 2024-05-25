import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import productManager from './productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

const PORT = 8080;

// Middleware para permitir formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para agregar la instancia de io al objeto de solicitud
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/', viewsRouter);

// Inicialización del servidor de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('createProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    });
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
