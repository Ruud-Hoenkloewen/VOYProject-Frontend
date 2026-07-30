import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { MOCK_ORDER_CONFIRMATION } from '../services/orderMockData';

/**
 * Custom hook para la pantalla de confirmación de compra.
 * Intenta obtener la orden real del backend; si no existe o falla, devuelve Mock Data.
 */
export function useOrderConfirmation(orderIdFromUrl, initialLocationState = null) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Si vinieron datos por React Router Location (checkout reciente)
    if (initialLocationState?.eventData) {
      const state = initialLocationState;
      const unit = state.eventData?.rawPrice || 6000;
      const qty = state.cantidad || 1;
      const sub = unit * qty;
      const fee = Math.round(sub * 0.10);
      const isDoor = state.paymentMethod === 'Pago en Puerta' || state.paymentMethod === 'door';
      
      const builtOrder = {
        orderId: orderIdFromUrl || state.orderId || `VOY-${Math.floor(10000 + Math.random() * 90000)}`,
        status: state.collectionStatus === 'rejected' ? 'rejected' : 'confirmed',
        paymentMethod: isDoor ? 'door' : 'online',
        paymentMethodDisplay: state.paymentMethod || (isDoor ? 'Pago en Puerta' : 'Online'),
        buyerName: typeof state.compradorData?.nombre === 'string'
          ? `${state.compradorData.nombre} ${state.compradorData.apellido || ''}`.trim()
          : 'Usuario VOY',
        buyerEmail: state.compradorData?.email || 'usuario@voyproject.ar',
        buyerPhone: state.compradorData?.telefono || '',
        eventTitle: state.eventData?.title || 'Evento VOY Project',
        eventDate: state.eventData?.date || 'Fecha por confirmar',
        eventTime: state.eventData?.time || '20:00 HS',
        venue: state.eventData?.venue || 'Venue',
        quantity: qty,
        unitPrice: unit,
        subtotal: sub,
        serviceFee: fee,
        total: sub + fee,
        tickets: [
          {
            id: `TICK-${orderIdFromUrl || '84920'}-01`,
            orderId: orderIdFromUrl || 'VOY-84920',
            eventTitle: state.eventData?.title || 'Evento VOY Project',
            eventDate: state.eventData?.date || 'Fecha por confirmar',
            eventTime: state.eventData?.time || '20:00 HS',
            venue: state.eventData?.venue || 'Venue',
            holderName: typeof state.compradorData?.nombre === 'string'
              ? `${state.compradorData.nombre} ${state.compradorData.apellido || ''}`.trim()
              : 'Usuario VOY',
            typeName: 'Entrada General',
            price: unit,
            qrUrl: typeof window !== 'undefined' ? window.location.href : 'https://voyproject.ar',
            genres: state.eventData?.genres || ['LIVE'],
          }
        ],
        createdAt: new Date().toISOString(),
      };

      setDataAndFinish(builtOrder, false);
      return;
    }

    // 2. Intento de llamada al backend real
    if (orderIdFromUrl) {
      try {
        const { data } = await api.get(`/orders/${orderIdFromUrl}`);
        if (data && (data._id || data.orderId)) {
          setDataAndFinish(data, false);
          return;
        }
      } catch (err) {
        console.warn('[useOrderConfirmation] GET /orders falló. Ejecutando fallback a Mock Data.');
      }
    }

    // 3. Fallback a Mock Data
    setDataAndFinish(MOCK_ORDER_CONFIRMATION, true);
  }, [orderIdFromUrl, initialLocationState]);

  const setDataAndFinish = (dataObj, fallbackBool) => {
    setOrder(dataObj);
    setIsFallback(fallbackBool);
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    error,
    isFallback,
    refetch: loadOrder,
  };
}
