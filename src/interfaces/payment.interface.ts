import { Event } from './event.interface';
import { User } from './user.interface';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface Payment {
  id: string;
  tranId: string;
  userId?: string | null;
  eventId?: string | null;
  eventTitle: string;
  amount: number | string;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  valId?: string | null;
  bankTranId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  event?: Event;
  user?: User;
}

export interface InitPaymentPayload {
  eventId: string;
  invitationId?: string;
}

export interface PaymentSessionResponse {
  tranId: string;
  gatewayUrl: string;
}
