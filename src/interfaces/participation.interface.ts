import { User } from './user.interface';
import { Event } from './event.interface';

export type ParticipationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';

export interface Participation {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipationStatus;
  decidedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  event?: Event;
  user?: User;
}

export interface JoinEventPayload {
  eventId: string;
  invitationId?: string;
}

export interface UpdateParticipationStatusPayload {
  status: 'APPROVED' | 'REJECTED' | 'BANNED';
}
