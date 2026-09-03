import RoomModel from "../models/room.model.js";

import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

export const read = async (req, res) => {
  try {
    const query = req.query;
    const filter = {};
    const sortFilter = {};

    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page || 0;
    const skip = page * limit;

    if (query.best_seller) {
      filter.bestSeller = query.best_seller === "true"
    }
    if (query.status) {
      filter.status = query.status === "true"
    }
    if (query.stock) {
      filter.stock = query.stock === "true"
    }
    if (query.new_Arrival) {
      filter.newArrival = query.new_Arrival === "true"
    }
    if (query.id) {
      filter._id = query.id
    }
    if (query.sort) {
      if (query.sort == "asc") {
        sortFilter.salePrice = 1
      } else if (query.sort == "dsc") {
        sortFilter.salePrice = -1
      }
    } else {
      sortFilter.createdAt = 1
    }

    const room = await RoomModel.find(filter).limit(limit).skip(skip).sort(sortFilter)
    const countDocument = await RoomModel.countDocuments();

    res.status(200).json({
      message: "Room data found",
      success: true,
      data: room,
      total: countDocument,
      pages: Math.ceil(countDocument / limit),
      limit
    });
  } catch (error) {
    sendServerError(res);
  }
};

export const readById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);

    if (!room) return sendNotFound(res);

    res.status(200).json({
      message: "Room data found",
      success: true,
      data: room,
    });
  } catch (error) {
    console.log(error);
    sendServerError(res);
  }
};

export const create = async (req, res) => {
  try {
    const imageUrl = req.file?.path || "";
    const { name, slug } = req.body;

    if (!name || !slug) return sendBadRequest(res);

    const room = await RoomModel.findOne({ slug });

    if (room) return sendConflict(res);

    await RoomModel.create({
      name,
      slug,
      image: imageUrl,
    });

    return sendCreated(res);
  } catch (error) {
    console.log(error);
    sendServerError(res);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await RoomModel.findById(id);

    if (!room) return sendNotFound(res);

    await RoomModel.findByIdAndUpdate(id, {
      $set: {
        status: !room.status,
      },
    });

    return sendSuccess(res, "Room Status Update");
  } catch (error) {
    console.log(error);
    sendServerError(res);
  }
};

export const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const room = await RoomModel.findById(id);

    if (!room) return sendNotFound(res);

    const imageUrl = req.file?.path || "";

    if (name) room.name = name;
    if (slug) room.slug = slug;
    if (imageUrl) room.image = imageUrl;

    await room.save();

    return sendSuccess(res, "Room Updated Successfully");
  } catch (error) {
    console.log(error);
    sendServerError(res);
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await RoomModel.findById(id);

    if (!room) return sendNotFound(res);

    await RoomModel.findByIdAndDelete(id);

    return sendSuccess(res, "Room Delete Successfully");
  } catch (error) {
    console.log(error);
    sendServerError(res);
  }
};