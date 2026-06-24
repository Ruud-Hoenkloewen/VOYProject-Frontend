import { useState, useEffect } from "react";

/**
 * HOOK: useDebounce
 * Devuelve una versión "demorada" de un valor — solo se actualiza
 * cuando el valor original deja de cambiar durante `delay` ms.
 *
 * Útil para inputs de búsqueda: evita disparar una petición a la API
 * en cada tecla, esperando a que el usuario termine de escribir.
 *
 * @param {*} value - Valor a debouncear (ej: texto del input).
 * @param {number} delay - Tiempo de espera en ms (default 300).
 * @returns {*} El valor debounceado.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si `value` cambia antes de que termine el timer, lo cancelamos
    // y arrancamos uno nuevo — esto es lo que genera el "debounce".
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}