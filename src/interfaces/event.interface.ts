import { User } from './user.interface';
import { Participation } from './participation.interface';
import { Review } from './review.interface';

export type Visibility = 'PUBLIC' | 'PRIVATE';
export type EventType = 'PUBLIC' | 'PRIVATE';

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  date?: string; // alias for eventDate for UI convenience
  venue?: string | null;
  location?: string | null; // alias for venue for UI convenience
  eventLink?: string | null;
  visibility: Visibility;
  type?: Visibility; // alias for visibility
  fee: number;
  capacity?: number;
  coverImage?: string | null;
  imageUrl?: string | null;
  bannerImage?: string | null;
  isFeatured: boolean;
  organizerId: string;
  hostId?: string; // alias
  createdAt: string;
  updatedAt?: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  host?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  _count?: {
    participations?: number;
    reviews?: number;
  };
  reviews?: Review[];
  userParticipation?: Participation | null;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  eventDate: string;
  venue?: string;
  eventLink?: string;
  visibility: Visibility;
  fee: number;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  isFeatured?: boolean;
}

export interface EventFilterParams {
  search?: string;
  type?: Visibility | 'ALL';
  visibility?: Visibility;
  feeType?: 'ALL' | 'FREE' | 'PAID';
  page?: number;
  limit?: number;
  sortBy?: 'eventDate' | 'createdAt' | 'fee';
  sortOrder?: 'asc' | 'desc';
}
