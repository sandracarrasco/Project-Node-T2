import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import  upload  from "../middlewares/upload.middleware.js";

//aqui definiremos que base de datos usar para las notas, en este caso MongoDB
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";
import NoteMysqlRepository from "../../infrastructure/database/mysql/note.mysql.repository.js";

// inyeccion de dependencias
const noteRepository = new NoteMongoRepository();
//const noteRepository = new NoteMysqlRepository();

const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

const router = Router();

//definir las rutas para las notas 
router.post("/", upload.single('image'), noteController.createNote);
router.get("/", noteController.getNotesByUserId);

export default router;