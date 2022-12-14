import express, { Application, Request, Response } from "express";
const app: Application = express();
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { checkSchema, validationResult } from "express-validator";
import prisma from "../client";

const corsOptions = {
  origin: "https://bbs-opal.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const messageSchema = {
  title: {
    isLength: {
      options: { min: 1, max: 140 },
    },
  },
  guestName: {
    isLength: {
      options: { min: 1, max: 10 },
    },
  },
};

app
  .route("/api/bbs")
  .get(async (req: Request, res: Response) => {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(messages);
  })
  .post(checkSchema(messageSchema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    await prisma.message.create({
      data: {
        id: uuidv4(),
        title: req.body.title,
        guestName: req.body.guestName,
      },
    });
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(messages);
  });

app.route("/api/bbs/:id").delete(async (req: Request, res: Response) => {
  const message = await prisma.message.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!message) {
    return res.json({ error: "message not found" });
  }
  await prisma.message.delete({
    where: {
      id: req.params.id,
    },
  });
  return res.json();
});

export default app;
