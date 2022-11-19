import express, { Application, Request, Response } from "express";
const app: Application = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";

const PORT = process.env.PORT || 8080;
const date = new Date();

app.use(express.json());

app
  .route("/api/bbs")
  .get(async (req: Request, res: Response) => {
    const messages = await prisma.message.findMany();
    console.log(messages);
    return res.json(messages);
  })
  .post(async (req: Request, res: Response) => {
    await prisma.message.create({
      data: {
        id: uuidv4(),
        name: req.body.name,
        title: req.body.title,
        created_at: date.toLocaleString("ja"),
      },
    });
    console.log("post message create");
    return res.json();
  });

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
