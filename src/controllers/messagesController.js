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
exports.MessageController = void 0;
const messagesService_1 = require("../services/messagesService");
const messageService = new messagesService_1.MessagesService();
class MessageController {
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, sender, receiver } = req.body;
                if (!content || typeof content !== "string") {
                    res.status(400).json({ message: "Invalid content." });
                    return;
                }
                const createdMessage = yield messageService.createMessage(content, sender, receiver);
                res
                    .status(201)
                    .json({
                    message: "Message created successfully.",
                    data: createdMessage,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId1, userId2 } = req.body;
                if (!userId1 || !userId2) {
                    res.status(400).json({ message: "Both user IDs are required." });
                    return;
                }
                const messages = yield messageService.getMessagesBetweenUsers(userId1, userId2);
                res.status(200).json({
                    message: "Messages retrieved successfully.",
                    data: messages,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
        });
    }
}
exports.MessageController = MessageController;
