import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { Pool } from "pg";
import "dotenv/config";
const app: Application = express();
const port = 5100;
const connectionString = process.env.DATABASE_URL;

app.use(express.json());

const pool = new Pool({
    connectionString,
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
    res.status(200).json({
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

        res.status(201).json({
            success: true,
            message: "User Created",
            body: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
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
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
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
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});
