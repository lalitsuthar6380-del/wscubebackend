import cartModel from "../models/cart.model.js";

import {
    sendBadRequest,
    sendConflict,
    sendCreated,
    sendNotFound,
    sendServerError,
    sendSuccess,
} from "../utils/response.js";

export const sync = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;

        const cartItems = JSON.parse(items);
        let userCart = null;

        if (!Array.isArray(cartItems)) {
            userCart = await cartModel.findOne({ userId }).populate(
                "items.productId",
                "_id title slug price salePrice thumbnail"
            );
            return res.status(200).json({
                message: "cart update",
                success: true,
                cart: userCart
            });

        }



        // Cart doesn't exist
        if (!userCart) {
            userCart = await CartModel.create({
                userId,
                items: cartItems
            });

            return sendCreated(res, userCart);
        }

        // Cart already exists
        cartItems.forEach((item) => {
            const existingItem = userCart.items.find(
                (userItem) =>
                    userItem.productId.toString() ===
                    item.productId.toString()
            );

            if (existingItem) {
                existingItem.qty += item.qty;
            } else {
                userCart.items.push(item);
            }
        });

        await userCart.save();

        await userCart.populate(
            "items.productId",
            "_id title slug price salePrice thumbnail"
        );

        return res.status(200).json({
            message: "cart update",
            success: true,
            cart: userCart
        });

    } catch (error) {
        console.log(error);
        return sendServerError(res);
    }
};