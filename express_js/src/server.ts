import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const port = 5100;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});
