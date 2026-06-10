// Genera hora sumando minutos a un string "HH:MM"
export const addMinutes = (timeStr, mins) => {
  const clean = timeStr?.replace(/\s*HS\s*/i, "") || "19:00";
  const [h, m] = clean.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "";
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
};

// Genera el slug de IG quitando tildes
export const igSlug = (name) =>
  name.toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i").replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u");

/**
 * Formatea un monto en pesos argentinos.
 * Centralizado para evitar duplicación (antes existía en 3 archivos).
 * @param {number} amount
 * @returns {string} Ej: "$ 7.999"
 */
export const formatPrice = (amount) => {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
};
