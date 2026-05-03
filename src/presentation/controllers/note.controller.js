export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res) => {
        const data = req.body;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        data.userId = req.user.id; 
        try {
            const note = await this.noteService.createNote(data);
            res.status(201).json({ success: true, data: note }); 
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    getNotesByUserId = async (req, res) => {
        const userId = req.user.id; // Obtenemos el id del usuario desde el token (authMiddleware)
        try {
            const notes = await this.noteService.getNotesByUserId(userId);
            res.status(200).json({ success: true, data: notes });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    getAllNotes = async (req, res) => {
        try {
            const notes = await this.noteService.getAllNotes();
            res.status(200).json({ success: true, data: notes });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    getNoteById = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            const note = await this.noteService.getNoteById(id, userId);
            res.status(200).json({ success: true, data: note });
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }

    updateNote = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const userId = req.user.id;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        
        try {
            const note = await this.noteService.updateNote(id, data, userId);
            res.status(200).json({ success: true, data: note });
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }

    deleteNote = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            const result = await this.noteService.deleteNote(id, userId);
            res.status(204).send();
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }

    shareNote = async (req, res) => {
        const { id } = req.params;
        const { email } = req.body;
        const currentUserId = req.user.id;

        if (!email) return res.status(400).json({ success: false, error: "Target email is required" });

        try {
            const result = await this.noteService.shareNoteByEmail(id, email, currentUserId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }
}