import { Schema } from 'dynamoose';

export const UserSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        name: 'email-index',
      },
    },
    name: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      index: {
        name: 'google-id-index',
      },
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
