"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const server_1 = require("../server");
const messages_1 = require("../models/messages");
const students_1 = require("../models/students");
const sendEmails_1 = require("../config/sendEmails");
class MessagesService {
    sendEmails(savedMessage, sender, receiver, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const receivers = yield students_1.Students.find({ _id: { $in: receiver } }, "email student_name");
            const senders = yield students_1.Students.find({ _id: { $in: sender } }, "student_name");
            const receiverEmails = receivers.map((receiver) => receiver.email);
            const receiverNames = receivers.map((receiver) => receiver.student_name);
            const senderNames = senders.map((sender) => sender.student_name);
            const emailPromises = receiverEmails.map((email, index) => {
                const studentName = receiverNames[index];
                const senderName = senderNames[index];
                return (0, sendEmails_1.messageNew)(studentName, senderName, email, content);
            });
            yield Promise.all(emailPromises);
        });
    }
    createMessage(content, sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new messages_1.Messages({
                content: content,
                sender: sender,
                receiver: receiver,
            });
            const savedMessage = yield newMessage.save();
            server_1.io.emit("newMessage", savedMessage);
            this.sendEmails(savedMessage, sender, receiver, content);
            return savedMessage;
        });
    }
    getMessagesBetweenUsers(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield messages_1.Messages.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 },
                ],
            })
                .sort({ createdAt: 1 })
                .exec();
            return messages;
        });
    }
}
exports.MessagesService = MessagesService;
