import { User } from './user.interface';

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface CreateReviewPayload {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
