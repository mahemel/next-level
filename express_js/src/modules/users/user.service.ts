import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDb = async (payload: IUser) => {
    const { name, email, password, age, role } = payload;
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, age, role) VALUES
        ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING *
    `,
        [name, email, hashedPassword, age, role],
    );

    delete result.rows[0].password;

    return result;
};

const allUsersFromDb = async () => {
    // const result = await pool.query(`
    //     SELECT * FROM users
    //         `);

    const result = await pool.query(`
        SELECT id, name, email, age, is_active, created_at, updated_at
    FROM users
            `);

    return result;
};

const getUserFromDB = async (id: string) => {
    const result = await pool.query(`
            SELECT * FROM users WHERE id=${id}
        `);
    return result;
};

const updateUserFromDb = async (
    payload: Partial<Pick<IUser, "name" | "password" | "age" | "is_active">>,
    id: string,
) => {
    const { name, password, age, is_active } = payload;

    const result = await pool.query(
        `
        UPDATE users 
        SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3,age),
        is_active = COALESCE($4, is_active),
        updated_at = NOW() 

        WHERE id=$5 RETURNING *
    `,
        [name ?? null, password ?? null, age ?? null, is_active ?? null, id],
    );

    return result;
};

const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(
        `
            DELETE FROM users 
            WHERE id=$1
            `,
        [id],
    );

    return result;
};

export const userService = {
    createUserIntoDb,
    allUsersFromDb,
    getUserFromDB,
    updateUserFromDb,
    deleteUserFromDB,
};
