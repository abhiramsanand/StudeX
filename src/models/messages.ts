import mongoose, { Schema, Document, Types } from "mongoose";

interface IMessages extends Document {
  content: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}

const MessagesSchema: Schema = new Schema(
  {
    content: { type: String, required: true, unique: true },
    sender: [{ type: Schema.Types.ObjectId, ref: "students", required: true }],
    receiver: [{ type: Schema.Types.ObjectId, ref: "students", required: true }],
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model<IMessages>("Messages", MessagesSchema);
export { Messages, IMessages };
