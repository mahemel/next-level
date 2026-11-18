import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { Pool } from "pg";

import config from "./config";

const app: Application = express();

app.use(express.json());

const pool = new Pool({
    connectionString: config.connectionString,
});

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                age INT,
                is_Active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            `);
        console.log("Database Connected!");
    } catch (error) {
        console.log(error);
    }
};

initDB();

app.get("/", (req: Request, res: Response) => {
    // res.send("Welcome to Express Server");
    return res.status(200).json({
        success: true,
        message: "Welcome to Express Server",
        author: "MH",
    });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
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
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
        SELECT * FROM users
            `);

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
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT * FROM users WHERE id=${id}
        `);

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
});

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, password, age, is_active } = req.body;

        const result = await pool.query(
            `
        UPDATE users 
        SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3,age),
        is_active = COALESCE($4, is_active),
        updated_at = NOW() 

        WHERE id=${id} RETURNING *
    `,
            [name ?? null, password ?? null, age ?? null, is_active ?? null],
        );

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
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM users 
            WHERE id=$1
            `,
            [id],
        );
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
});

app.listen(config.port, () => {
    console.log(`Server running on ${config.port}.`);
});
