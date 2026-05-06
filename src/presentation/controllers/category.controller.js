export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        const data = req.body;
        data.userId = req.user.id;
        try {
            const category = await this.categoryService.createCategory(data);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    getCategoriesByUserId = async (req, res) => {
        const userId = req.user.id;
        try {
            const categories = await this.categoryService.getCategoriesByUserId(userId);
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    getAllCategories = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    getCategoryById = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            const category = await this.categoryService.getCategoryById(id, userId);
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }

    updateCategory = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const userId = req.user.id;

        try {
            const category = await this.categoryService.updateCategory(id, data, userId);
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }

    deleteCategory = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            await this.categoryService.deleteCategory(id, userId);
            res.status(204).send();
        } catch (error) {
            if (error.message.includes("found")) return res.status(404).json({ success: false, error: error.message });
            if (error.message.includes("authorized")) return res.status(403).json({ success: false, error: error.message });
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
