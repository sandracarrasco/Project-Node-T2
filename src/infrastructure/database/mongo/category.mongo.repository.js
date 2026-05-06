import CategoryModel from './category.model.js';
import CategoryEntity from '../../../domain/entities/category.entity.js';

export default class CategoryMongoRepository {
    async save(category) {
        const categoryModel = new CategoryModel(category);
        const savedCategory = await categoryModel.save();
        return this._mapToEntity(savedCategory);
    }

    async findByUserId(userId) {
        const categories = await CategoryModel.find({ userId });
        return categories.map(this._mapToEntity);
    }

    async findById(id) {
        const category = await CategoryModel.findById(id);
        if (!category) return null;
        return this._mapToEntity(category);
    }

    async findAll() {
        const categories = await CategoryModel.find();
        return categories.map(this._mapToEntity);
    }

    async update(id, data) {
        const category = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
        if (!category) return null;
        return this._mapToEntity(category);
    }

    async delete(id) {
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) return null;
        return this._mapToEntity(category);
    }

    _mapToEntity(categoryDoc) {
        return new CategoryEntity({
            id: categoryDoc._id.toString(),
            name: categoryDoc.name,
            description: categoryDoc.description,
            userId: categoryDoc.userId
        });
    }
}
