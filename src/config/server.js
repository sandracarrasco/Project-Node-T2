import express from 'express';
import cors from 'cors';    
import 'express-async-errors';
import morgan from 'morgan';
import { loggerMiddleware } from '../presentation/middlewares/logger.middleware.js';
import noteRoutes from '../presentation/routes/note.routes.js';
import authRoutes from '../presentation/routes/auth.routes.js';
import { setupSwagger } from './swagger.js';

export const createServer = () => {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(loggerMiddleware);
    app.use(morgan('dev'));

    // Imágenes estáticas
    app.use('/uploads', express.static('uploads'));

    // Rutas
    app.use('/api/v1/notes', noteRoutes);
    app.use('/api/v1/auth', authRoutes);

    // Documentación Swagger
    setupSwagger(app);

    // Healthcheck
    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'OK', message: 'API de notas activa' });
    });

    // Middleware de manejo de errores global
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    });

    return app;
};
