import { Request, Response } from "express";
import { MessagesService } from "../services/messagesService";

const messageService = new MessagesService();

export class MessageController {
  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, sender, receiver } = req.body;

      if (!content || typeof content !== "string") {
        res.status(400).json({ message: "Invalid content." });
        return;
      }

      const createdMessage = await messageService.createMessage(
        content,
        sender,
        receiver
      );

      res
        .status(201)
        .json({
          message: "Message created successfully.",
          data: createdMessage,
        });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { userId1, userId2 } = req.body;

      if (!userId1 || !userId2) {
        res.status(400).json({ message: "Both user IDs are required." });
        return;
      }

      const messages = await messageService.getMessagesBetweenUsers(
        userId1,
        userId2
      );

      res.status(200).json({
        message: "Messages retrieved successfully.",
        data: messages,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}
