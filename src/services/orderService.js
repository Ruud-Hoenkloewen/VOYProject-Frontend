import api from "./api";

/**
 * createOrder — crea una orden de compra
 * POST /api/orders
 * @param {object} orderData - Datos de la orden (eventId, cantidad, compradorData, metodoPago, etc.)
 * @returns {object} Respuesta del servidor
 */
export const createOrder = async (orderData) => {
  try {
    const { data } = await api.post("/orders", orderData);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * getMyOrders — obtiene las órdenes del usuario logueado
 * GET /api/orders/mis-ordenes
 * @returns {Array} Lista de órdenes
 */
export const getMyOrders = async () => {
  try {
    const { data } = await api.get("/orders/mis-ordenes");
    return data;
  } catch (error) {
    console.error("Error fetching my orders:", error);
    throw error;
  }
};

/**
 * createPaymentPreference - crea una preferencia de pago en Mercado Pago
 * POST /api/payments/create-preference
 */
export const createPaymentPreference = async (paymentData) => {
  try {
    const { data } = await api.post("/payments/create-preference", paymentData);
    return data;
  } catch (error) {
    console.error("Error creating payment preference:", error);
    throw error;
  }
};
