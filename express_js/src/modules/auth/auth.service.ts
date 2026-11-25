import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoApp = async (payload: {
    email: string;
    password: string;
}) => {
    //check if user exist -> Done
    //check if password matches -> Done
    //check the user status -> Done
    //if passed, then generate jwt token

    const { email, password } = payload;
    const user = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email],
    );

    if (user.rowCount === 0) {
        throw new Error("Invalid Credentials!");
    }

    const matchPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!matchPassword) {
        throw new Error("Invalid Credentials!");
    }

    if (!user.rows[0].is_active) {
        throw new Error("Access Denied!");
    }
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret_key, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret_key, {
        expiresIn: "10d",
    });

    delete user.rows[0].password;

    return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
    if (!token) {
        throw new Error("Unauthorized Access!");
    }

    const decode = jwt.verify(
        token as string,
        config.refresh_secret_key,
    ) as JwtPayload;

    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decode.email,
    ]);

    if (user.rowCount === 0) {
        throw new Error("User not found!");
    }

    if (!user.rows[0].is_active) {
        throw new Error("Forbidden Access!");
    }
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret_key, {
        expiresIn: "1h",
    });

    return { accessToken };
};

export const authService = {
    loginUserIntoApp,
    generateAccessToken,
};
