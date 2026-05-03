import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import  upload  from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

// Importamos el repositorio de MongoDB y el servicio de Mail
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

// inyeccion de dependencias
const mailService = new MailService();
const noteRepository = new NoteMongoRepository();
const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Gestión de notas
 */

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     summary: Crear una nueva nota
 *     description: Crea una nota nueva para el usuario autenticado. Permite subir una imagen opcional.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la nota
 *               content:
 *                 type: string
 *                 description: Contenido de la nota
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (opcional)
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Error en la solicitud, datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authMiddleware, upload.single('imageUrl'), noteController.createNote);

/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Obtener todas las notas del usuario actual
 *     description: Retorna un listado de notas asociadas al usuario autenticado.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron notas
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, noteController.getNotesByUserId);

/**
 * @swagger
 * /api/v1/notes/all:
 *   get:
 *     summary: Obtener todas las notas del sistema (Solo Admin)
 *     description: Devuelve todas las notas registradas en el sistema. Requiere privilegios de administrador.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las notas obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, requiere rol de admin
 *       500:
 *         description: Error del servidor
 */
router.get("/all", authMiddleware, roleMiddleware(["admin"]), noteController.getAllNotes);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     summary: Obtener una nota por su ID
 *     description: Obtiene los detalles de una nota específica dado su ID.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota a buscar
 *     responses:
 *       200:
 *         description: Nota obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para acceder a esta nota
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", authMiddleware, noteController.getNoteById);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   put:
 *     summary: Actualizar una nota existente (Solo Admin)
 *     description: Permite modificar una nota existente. Requiere ser el creador de la nota o administrador.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota a actualizar
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título de la nota
 *               content:
 *                 type: string
 *                 description: Nuevo contenido de la nota
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen para reemplazar la actual
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para modificar esta nota
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", authMiddleware, upload.single('imageUrl'), roleMiddleware(["admin"]), noteController.updateNote);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     summary: Eliminar una nota (Solo Admin)
 *     description: Elimina una nota del sistema de forma permanente. Requiere rol de administrador.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota a eliminar
 *     responses:
 *       204:
 *         description: Nota eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido, no tiene permisos
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);

/**
 * @swagger
 * /api/v1/notes/{id}/share:
 *   post:
 *     summary: Compartir una nota por email
 *     description: Envía los detalles de la nota especificada a un correo electrónico proporcionado.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la nota a compartir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo destino
 *                 example: destino@example.com
 *     responses:
 *       200:
 *         description: Nota compartida exitosamente
 *       400:
 *         description: Error en la solicitud o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/:id/share", authMiddleware, noteController.shareNote);


export default router;