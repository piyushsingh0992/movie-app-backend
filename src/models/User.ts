import { Schema, model, Document, Types } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  role: 'user' | 'admin';
  favorites: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

export default model<IUser>('User', userSchema);
