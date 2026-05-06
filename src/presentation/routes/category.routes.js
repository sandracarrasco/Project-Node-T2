import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

// Importamos el repositorio de MongoDB
import CategoryMongoRepository from "../../infrastructure/database/mongo/category.mongo.repository.js";

// inyeccion de dependencias
const categoryRepository = new CategoryMongoRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías para notas
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Crea una categoría nueva para el usuario autenticado.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: Ideas
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría (opcional)
 *                 example: Categoría para ideas creativas
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error en la solicitud, datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Obtener todas las categorías del usuario actual
 *     description: Retorna un listado de categorías asociadas al usuario autenticado.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron categorías
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, categoryController.getCategoriesByUserId);

/**
 * @swagger
 * /api/v1/categories/all:
 *   get:
 *     summary: Obtener todas las categorías del sistema (Solo Admin)
 *     description: Devuelve todas las categorías registradas en el sistema. Requiere privilegios de administrador.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las categorías obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, requiere rol de admin
 *       500:
 *         description: Error del servidor
 */
router.get("/all", authMiddleware, roleMiddleware(["admin"]), categoryController.getAllCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     description: Obtiene los detalles de una categoría específica dado su ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría a buscar
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para acceder a esta categoría
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", authMiddleware, categoryController.getCategoryById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     description: Permite modificar una categoría existente. Solo el creador puede actualizarla.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para modificar esta categoría
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", authMiddleware, categoryController.updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     description: Elimina una categoría del sistema de forma permanente. Solo el creador puede eliminarla.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría a eliminar
 *     responses:
 *       204:
 *         description: Categoría eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, no tiene permisos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

export default router;
