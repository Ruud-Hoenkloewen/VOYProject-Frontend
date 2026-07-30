/**
 * Mock Data para confirmación de compra y entrada digital (TicketStub).
 */

export const MOCK_ORDER_CONFIRMATION = {
  orderId: "VOY-84920",
  status: "confirmed",
  paymentMethod: "online",
  paymentMethodDisplay: "Mercado Pago (Tarjeta de Crédito / Débito)",
  buyerName: "Juan Pérez",
  buyerEmail: "juan.perez@example.com",
  buyerPhone: "+54 381 555-1234",
  eventTitle: "TUCUMÁN PUNK FEST VI",
  eventDate: "15 AGO 2026",
  eventTime: "22:00 HS",
  venue: "El Galpón Cultural",
  city: "San Miguel de Tucumán",
  quantity: 2,
  unitPrice: 6000,
  subtotal: 12000,
  serviceFee: 1200,
  total: 13200,
  createdAt: new Date().toISOString(),
  tickets: [
    {
      id: "TICK-84920-01",
      orderId: "VOY-84920",
      eventTitle: "TUCUMÁN PUNK FEST VI",
      eventDate: "15 AGO 2026",
      eventTime: "22:00 HS",
      venue: "El Galpón Cultural",
      city: "San Miguel de Tucumán",
      holderName: "Juan Pérez",
      typeName: "Entrada General - Preventa 1",
      price: 6000,
      qrUrl: "https://voyproject.ar/compra/confirmacion?orderId=VOY-84920",
      genres: ["PUNK", "HARDCORE"],
    },
  ],
};
