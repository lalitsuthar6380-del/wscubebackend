import CategoryModel from "../models/category.model.js";
import {
    sendBadRequest,
    sendConflict,
    sendCreated,
    sendNotFound,
    sendServerError,
    sendSuccess
} from "../utils/response.js";

export const read = async (req, res) => {
    try {
        const query = req.query;

        const filter = {};
        const sortFilter = {};

        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 0;
        const skip = page * limit;

        // Status Filter
        if (query.status !== undefined) {
            filter.status = query.status === "true";
        }

        // Search by name
        if (query.search) {
            filter.name = {
                $regex: query.search,
                $options: "i"
            };
        }

        // Sort
        if (query.sort === "asc") {
            sortFilter.name = 1;
        } else if (query.sort === "dsc") {
            sortFilter.name = -1;
        } else {
            sortFilter.createdAt = -1;
        }

        const category = await CategoryModel
            .find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortFilter);

        const countDocument = await CategoryModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Category data found",
            data: category,
            total: countDocument,
            pages: Math.ceil(countDocument / limit),
            limit
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};

export const readById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        if (!category) {
            return sendNotFound(res);
        }

        return res.status(200).json({
            success: true,
            message: "Category data found",
            data: category
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


export const create = async (req, res) => {
    try {
        const imageUrl = req.file?.path || "";

        const { name, slug } = req.body;

        if (!name || !slug) {
            return sendBadRequest(res);
        }

        const category = await CategoryModel.findOne({ slug });

        if (category) {
            return sendConflict(res);
        }

        await CategoryModel.create({
            name,
            slug,
            image: imageUrl
        });

        return sendCreated(res);

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};



export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        if (!category) {
            return sendNotFound(res);
        }

        category.status = !category.status;

        await category.save();

        return sendSuccess(
            res,
            "Category status updated"
        );

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};

export const edit = async (req, res) => {
    try {
        const { id } = req.params;

        const imageUrl = req.file?.path || "";

        const category = await CategoryModel.findById(id);

        if (!category) {
            return sendNotFound(res);
        }

        const { name, slug } = req.body;

        // Check slug duplicate
        if (slug && slug !== category.slug) {

            const existingCategory =
                await CategoryModel.findOne({
                    slug,
                    _id: { $ne: id }
                });

            if (existingCategory) {
                return sendConflict(res);
            }
        }

        if (name) {
            category.name = name;
        }

        if (slug) {
            category.slug = slug;
        }

        if (imageUrl) {
            category.image = imageUrl;
        }

        await category.save();

        return sendSuccess(
            res,
            "Category updated successfully"
        );

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};

export const deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        if (!category) {
            return sendNotFound(res);
        }

        await CategoryModel.findByIdAndDelete(id);

        return sendSuccess(
            res,
            "Category deleted successfully"
        );

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};