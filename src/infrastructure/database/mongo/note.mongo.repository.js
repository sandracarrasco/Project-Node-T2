import NoteModel from "./note.model.js";

export default class NoteMongoRepository {
    async save(noteEntity) {
        const note = new NoteModel({
            title: noteEntity.title,
            content: noteEntity.content,
            imageUrl: noteEntity.imageUrl,
            isPrivate: noteEntity.isPrivate,
            password: noteEntity.password,
            userId: noteEntity.userId,
            categoryId: noteEntity.categoryId
        });
        const savedNote = await note.save();
        return savedNote.toObject();
    }

    async findByUserId(userId) {
        return await NoteModel.find({ userId }).populate('categoryId');
    }

    async findAll() {
        return await NoteModel.find().populate('categoryId');
    }

    async findById(id) {
        return await NoteModel.findById(id).populate('categoryId');
    }

    async findByCategoryId(categoryId) {
        return await NoteModel.find({ categoryId }).populate('categoryId');
    }

    async update(id, data) {
        return await NoteModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        await NoteModel.findByIdAndDelete(id);
        return true;
    }
}