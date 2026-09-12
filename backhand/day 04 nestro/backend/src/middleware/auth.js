import UserModel from "../models/user.model.js";
import { sendServerError } from "../utils/response.js"
import jwt from "jsonwebtoken";

export async function protect(req, res, next) {
    try {
        let token = null;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if(!token){
            token = req.headers.authorizaton;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await UserModel.findOne({ _id: decoded.id }).select("-password");
        req.user = user;
        next();


    } catch (error) {
        return sendServerError(res);
    }
}

export function authorized(roles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please login first"
                });
            }

            if (!roles.includes(req.user.roles)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You are not authorized"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    };
}