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

// Definir las rutas para las notas  
router.post("/", authMiddleware, upload.single('imageUrl'), noteController.createNote);
router.get("/", authMiddleware, noteController.getNotesByUserId);
router.get("/:id", authMiddleware, noteController.getNoteById);
router.put("/:id", authMiddleware, upload.single('imageUrl'), roleMiddleware(["admin"]), noteController.updateNote);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);
router.post("/:id/share", authMiddleware, noteController.shareNote);
router.get("/all", authMiddleware, roleMiddleware(["admin"]), noteController.getAllNotes);

export default router;