import cartModel from "../models/cart.model.js";
import OrderModel from "../models/order.model.js";

import {
    sendBadRequest,
    sendConflict,
    sendCreated,
    sendNotFound,
    sendServerError,
    sendSuccess,
} from "../utils/response.js";

export const Orderplace = async (req, res) => {
    try {
        const userId = req.user._id;

        const { shippingAddress, payment_method } = req.body;

        const cart = await cartModel
            .findOne({ UserId: userId })
            .populate(
                "items.productId",
                "_id title slug price salePrice thumbnail"
            );

        if (!cart) {
            return sendNotFound(res);
        }

        if (!cart.items || cart.items.length === 0) {
            return sendBadRequest(res, "Cart is empty");
        }

        const items = cart.items.map((item) => {
            const { salePrice, _id } = item.productId;

            return {
                product_id: _id,
                qty: item.qty,
                price: salePrice,
                total: salePrice * item.qty,
            };
        });

        const total = items.reduce(
            (sum, item) => sum + item.total,
            0
        );

        const createdOrder = await OrderModel.create({
            user_id: userId,
            items,
            shippingAddress,
            payment_method,
            subtotal: total,
            total_amount: total,
        });

        if (payment_method === "cod") {
            await cartModel.findOneAndUpdate(
                { UserId: userId },
                { $set: { items: [] } }
            );

            return res.status(201).json({
                message: "Order created successfully",
                success: true,
                orderId: createdOrder._id,
            });
        }

        if (payment_method === "online") {
            return res.status(200).json({
                success: true,
                message: "Order created. Online payment is pending.",
                orderId: createdOrder._id,
            });
        }

        return sendBadRequest(res, "Invalid payment method");

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};

export const read = async (req, res) => {
    try {
        const query = req.query;

        const filter = {};
        const sortFilter = {};

        const limit = query.limit
            ? parseInt(query.limit)
            : 10;

        const page = query.page
            ? parseInt(query.page)
            : 0;

        const skip = page * limit;

        if (query.id) {
            filter._id = query.id;
        }

        if (query.sort) {
            if (query.sort === "asc") {
                sortFilter.createdAt = 1;
            } else if (query.sort === "dsc") {
                sortFilter.createdAt = -1;
            }
        } else {
            sortFilter.createdAt = -1;
        }

        const order = await OrderModel.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortFilter);

        const countDocument =
            await OrderModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Order data found",
            data: order,
            total: countDocument,
            pages: Math.ceil(countDocument / limit),
            limit,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};

export const myOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : 3;

        const page = req.query.page
            ? parseInt(req.query.page)
            : 0;

        const skip = page * limit;

        const orders = await OrderModel.find({
            user_id: userId,
        })
            .populate(
                "items.product_id",
                "_id title slug price salePrice thumbnail"
            )
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await OrderModel.countDocuments({
            user_id: userId,
        });

        return res.status(200).json({
            success: true,
            message: "My orders found",
            data: orders,
            total,
            pages: Math.ceil(total / limit),
            limit,
        });
    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};