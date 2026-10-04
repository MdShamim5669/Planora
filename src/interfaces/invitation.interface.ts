import { User } from './user.interface';
import { Event } from './event.interface';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface Invitation {
  id: string;
  eventId: string;
  inviteeId: string;
  status: InvitationStatus;
  respondedAt?: string | null;
  createdAt: string;
  event?: Event;
  invitee?: User;
}

export interface SendInvitationPayload {
  eventId: string;
  email: string;
}

export interface RespondInvitationPayload {
  status: 'ACCEPTED' | 'DECLINED';
}
