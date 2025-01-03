import { Schema, Types } from "mongoose";
import { IMessages, Messages } from "../models/messages";


export class MessagesService {
  async createMessage(
    content: string,
    sender: string[],
    receiver: string[]
  ): Promise<IMessages> {

    const newMessage = new Messages({
        content: content,
        sender: sender,
        receiver: receiver
      });
  
      return await newMessage.save();
  }

  async getMessagesBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<IMessages[]> {
    const messages = await Messages.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }
}
