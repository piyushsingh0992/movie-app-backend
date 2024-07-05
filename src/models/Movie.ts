import { Schema, model, Document, Types } from 'mongoose';

interface IMovie extends Document {
  name: string;
  description: string;
  runningTime: string;
  imageUrl: string;
  comments: Types.ObjectId[];
}

const movieSchema = new Schema<IMovie>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  runningTime: { type: String, required: true },
  imageUrl: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

export default model<IMovie>('Movie', movieSchema);
