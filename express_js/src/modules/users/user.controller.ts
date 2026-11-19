import type { Request, Response } from "express";
import { pool } from "../../db";

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, age } = req.body;

        const result = await pool.query(
            `
        INSERT INTO users (name, email, password, age) VALUES
        ($1, $2, $3, $4) RETURNING *
    `,
            [name, email, password, age],
        );

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
export const userController = {
    createUser,
};
