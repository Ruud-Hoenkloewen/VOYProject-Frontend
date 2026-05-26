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
