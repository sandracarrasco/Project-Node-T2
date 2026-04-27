import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
    }

    async createNote(data) {
        if (!data.title || !data.content) { throw new Error("Title and content are required"); }

        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId){
        return await this.noteRepository.findByUserId(userId);
    }

    async getAllNotes() {
        return await this.noteRepository.findAll();
    }

    async getNoteById(id, userId) {
        const note = await this.noteRepository.findById(id);
        if (!note) throw new Error("Note not found");
        if (note.userId !== userId) throw new Error("Not authorized to view this note");
        return note;
    }

    async updateNote(id, data, userId) {
        const existingNote = await this.noteRepository.findById(id);
        if (!existingNote) throw new Error("Note not found");
        if (existingNote.userId !== userId) throw new Error("Not authorized to update this note");

        return await this.noteRepository.update(id, data);
    }

    async deleteNote(id, userId) {
        const existingNote = await this.noteRepository.findById(id);
        if (!existingNote) throw new Error("Note not found");
        if (existingNote.userId !== userId) throw new Error("Not authorized to delete this note");

        return await this.noteRepository.delete(id);
    }

    async shareNoteByEmail(id, email, currentUserId) {
        const note = await this.noteRepository.findById(id);
        if (!note) throw new Error("Note not found");

        // Opcional: verificar que el usuario sea el dueño
        if (note.userId !== currentUserId) throw new Error("You are not authorized to share this note");

        if (this.mailService) {
            await this.mailService.sendMail(email, "Nota compartida", `Te han compartido una nota: ${note.title}\n\nContenido: ${note.content}`);
        }

        return { message: "Note shared successfully" };
    }
}