import NoteModel from "./models/note.model.js";  

export default class NoteMySQLRepository {
    async save(noteEntity) {
          const note = await NoteModel.create({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId
        });
        return note.toJSON();
    }
    async findByUserId(userId) {
        return await NoteModel.findAll({ where: { userId } });
    }
}