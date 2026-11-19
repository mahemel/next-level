import type { Request, Response } from "express";
import { userService } from "./user.service";
import { Result } from "pg";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserIntoDb(req.body);

        return res.status(201).json({
            success: true,
            message: "User Created",
            body: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.allUsersFromDb();

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const getSignleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserFromDB(id as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User data retrieved successfully!",
            data: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await userService.updateUserFromDb(
            req.body,
            id as string,
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Updated successfully!",
            data: result.rows[0],
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await userService.deleteUserFromDB(id as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted Successfully!",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

export const userController = {
    createUser,
    getAllUser,
    getSignleUser,
    updateUser,
    deleteUser,
};
