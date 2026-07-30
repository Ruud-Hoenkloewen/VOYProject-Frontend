/**
 * Tipos e interfaces TypeScript para confirmación de compra y entrada digital (TicketStub).
 */

export type PaymentMethod = 'online' | 'door' | 'efectivo' | 'transferencia' | string;

export interface Ticket {
  id: string;
  orderId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city?: string;
  holderName: string;
  typeName: string;
  price: number;
  qrUrl: string;
  genres?: string[];
}

export interface OrderDetails {
  orderId: string;
  status: 'confirmed' | 'pending' | 'rejected';
  paymentMethod: PaymentMethod;
  paymentMethodDisplay?: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  tickets: Ticket[];
  createdAt: string;
}
