import express, { Application, Request, Response } from "express";
const app: Application = express();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { checkSchema, validationResult } from "express-validator";

const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "https://bbs-opal.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app
  .route("/api/bbs")
  .get(async (req: Request, res: Response) => {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(messages);
  })
  .post(async (req: Request, res: Response) => {
    await prisma.message.create({
      data: {
        id: uuidv4(),
        title: req.body.title,
        guestName: req.body.guestName,
      },
    });
    return res.json();
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

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
