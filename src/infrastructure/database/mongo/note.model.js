import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    isPrivate: { type: Boolean, default: false },
    password: { type: String },
    userId: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

export default model('Note', noteSchema);