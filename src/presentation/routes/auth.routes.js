import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../../application/use-cases/auth.service.js";
import UserMongoRepository from "../../infrastructure/database/mongo/user.mongo.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

// Inyección de dependencias
const userRepository = new UserMongoRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController({ authService });

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

// Solo los administradores pueden registrar nuevos usuarios
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario (Solo Admin)
 *     description: Permite a un administrador registrar nuevos usuarios en el sistema.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Error en la solicitud o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado, token inválido o ausente
 *       403:
 *         description: Prohibido, el usuario no tiene permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", authMiddleware, authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario con su correo y contraseña y devuelve un token JWT.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secreta123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Bearer token
 *       400:
 *         description: Faltan credenciales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", authController.login);

export default router;