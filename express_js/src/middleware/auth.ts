import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            //console.log(roles);["admin"]
            //1. Check if the token exists
            //2. Verify Token
            //3. Check if the user exists
            //4. Check if user status is active

            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access!",
                });
            }

            const decode = jwt.verify(
                token as string,
                config.jwt_secret_key,
            ) as JwtPayload;

            const user = await pool.query(
                `SELECT * FROM users WHERE email=$1`,
                [decode.email],
            );

            if (user.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!",
                });
            }

            if (!user.rows[0].is_active) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden Access!",
                });
            }

            //roles = ["admin", "superAdmin", "user"]

            if (roles.length && !roles.includes(user.rows[0].role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access!",
                });
            }

            req.user = decode;
            // console.log(req.user);
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;
