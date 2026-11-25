import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserIntoApp(req.body);

        const { refreshToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: false, // http-> False \ https->true ** True for production
            httpOnly: true, // to prevent xss attack
            sameSite: "lax", //none" - set on any domain, "strict", "lax" -> to prevent CSRF attack
            // maxAge
            path: "/",
            domain: "localhost", //.example.com
        });

        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const generateToken = async (req: Request, res: Response) => {
    try {
        const result = await authService.generateAccessToken(
            req.cookies.refreshToken,
        );

        // return res.status(200).json({
        //     success: true,
        //     message: "Access Token Generated Successfully",
        //     data: result,
        // });
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Access Token Generated Successfully",
            data: result,
        });
    } catch (error: any) {
        // return res.status(500).json({
        //     success: false,
        //     message: error?.message,
        //     error: error,
        // });

        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error?.message,
            error: error,
        });
    }
};
export const authController = {
    loginUser,
    generateToken,
};
