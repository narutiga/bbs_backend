import request from "supertest";
import { prismaMock } from "../singleton";
import app from "./app";

describe("Test the api/bbs path", () => {
  test("It should get message", async () => {
    const dummyMessage = {
      id: "1",
      guestName: "naruga",
      title: "おなかすいた！",
      createdAt: new Date(),
    };

    prismaMock.message.findMany.mockResolvedValue([dummyMessage]);

    const response = await request(app).get("/api/bbs");

    expect(response.statusCode).toBe(200);
    expect(response.body[0].id).toBe("1");
    expect(response.body[0].guestName).toBe("naruga");
    expect(response.body[0].title).toBe("おなかすいた！");
  });

  test("It should create message", async () => {
    const dummyMessage = {
      id: "1",
      guestName: "tiga",
      title: "あそんで！",
      createdAt: new Date(),
    };

    prismaMock.message.create.mockResolvedValue(dummyMessage);

    const response = await request(app)
      .post("/api/bbs")
      .send({ guestName: "tiga", title: "あそんで！" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("");
  });
});
