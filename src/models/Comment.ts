import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  text: string;
  movie: Types.ObjectId;
  user: Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default model<IComment>('Comment', commentSchema);
