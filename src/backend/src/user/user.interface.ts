export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  email: string;
  name: string;
  googleId?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}