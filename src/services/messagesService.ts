import { io } from "../server";
import { IMessages, Messages } from "../models/messages";
import { Students } from "../models/students";
import { messageNew } from "../config/sendEmails";

export class MessagesService {
  async sendEmails(
    savedMessage: IMessages,
    sender: string[],
    receiver: string[],
    content: string
  ) {
    const receivers = await Students.find(
      { _id: { $in: receiver } },
      "email student_name"
    );
    const senders = await Students.find(
      { _id: { $in: sender } },
      "student_name"
    );

    const receiverEmails = receivers.map((receiver) => receiver.email);
    const receiverNames = receivers.map((receiver) => receiver.student_name);
    const senderNames = senders.map((sender) => sender.student_name);

    const emailPromises = receiverEmails.map((email, index) => {
      const studentName = receiverNames[index];
      const senderName = senderNames[index];
      return messageNew(studentName, senderName, email, content);
    });

    await Promise.all(emailPromises);
  }

  async createMessage(
    content: string,
    sender: string[],
    receiver: string[]
  ): Promise<IMessages> {
    const newMessage = new Messages({
      content: content,
      sender: sender,
      receiver: receiver,
    });

    const savedMessage = await newMessage.save();

    io.emit("newMessage", savedMessage);

    this.sendEmails(savedMessage, sender, receiver, content);
    return savedMessage;
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