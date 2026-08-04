import { jsPDF } from 'jspdf';

/**
 * Convierte un elemento SVG (como el código QR) a DataURL PNG para incrustar en jsPDF.
 */
export const svgToPngDataUrl = (svgElement) => {
  return new Promise((resolve) => {
    if (!svgElement) {
      resolve(null);
      return;
    }
    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 300, 300);
        context.drawImage(image, 0, 0, 300, 300);
        const png = canvas.toDataURL('image/png');
        URL.revokeObjectURL(blobURL);
        resolve(png);
      };
      image.onerror = () => resolve(null);
      image.src = blobURL;
    } catch (e) {
      console.error('Error convirtiendo QR a PNG:', e);
      resolve(null);
    }
  });
};

/**
 * Genera y descarga el archivo PDF de la entrada oficial.
 * @param {object} order - Datos de la orden (numeroOrden, datosComprador, total, etc.)
 * @param {object} eventData - Datos del evento (title, date, time, venue, etc.)
 * @param {HTMLElement} qrSvgElement - Opcional. Elemento SVG del QR rendered
 */
export const downloadTicketPDF = async (order, eventData, qrSvgElement = null) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const orderId = order?.numeroOrden || (order?._id ? `VOY-${order._id.slice(-5).toUpperCase()}` : 'VOY-ENTRADA');
  const titularName = typeof order?.datosComprador?.nombre === 'string'
    ? `${order.datosComprador.nombre} ${order.datosComprador.apellido || ''}`.trim()
    : 'Usuario VOY';
  const titularEmail = order?.datosComprador?.email || '';
  const cantidad = order?.cantidad || 1;
  const metodoPago = order?.metodoPago === 'mercadopago' ? 'MercadoPago' : (order?.metodoPago || 'Tarjeta / Efectivo');
  
  const eventTitle = eventData?.title || eventData?.nombre || 'Evento VOY Project';
  const eventDate  = eventData?.date  || (eventData?.fecha ? new Date(eventData.fecha).toLocaleDateString('es-AR') : 'Fecha a confirmar');
  const eventTime  = eventData?.time  || (eventData?.hora ? `${eventData.hora} HS` : '20:00 HS');
  const eventVenue = eventData?.venue || eventData?.lugar || 'Lugar a confirmar';
  const totalMonto = order?.total || order?.montoTotal || (eventData?.rawPrice ? eventData.rawPrice * cantidad : 0);

  // 1. Fondo Oscuro Canvas (210mm x 297mm)
  doc.setFillColor(8, 9, 13);
  doc.rect(0, 0, 210, 297, 'F');

  // 2. Encabezado Branding Banner
  doc.setFillColor(18, 20, 28);
  doc.rect(15, 15, 180, 28, 'F');
  
  // Borde Neón superior
  doc.setFillColor(0, 255, 159);
  doc.rect(15, 15, 180, 2, 'F');

  // Logo VOY PROJECT
  doc.setTextColor(0, 255, 159);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VOY PROJECT', 22, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ENTRADA OFICIAL DE INGRESO • VOYPROJECT.AR', 22, 36);

  // Número de comprobante a la derecha
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.text('Nº ORDEN', 185, 27, { align: 'right' });
  doc.setTextColor(0, 255, 159);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(orderId, 185, 34, { align: 'right' });

  // 3. Tarjeta de Entrada Principal
  doc.setFillColor(18, 20, 28);
  doc.rect(15, 48, 180, 105, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.rect(15, 48, 180, 105, 'S');

  // Badge TIPO
  doc.setFillColor(0, 255, 159);
  doc.rect(22, 54, 38, 7, 'F');
  doc.setTextColor(8, 9, 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ENTRADA GENERAL', 41, 59, { align: 'center' });

  // Título Evento
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  
  // Truncar título si es muy largo
  const splitTitle = doc.splitTextToSize(eventTitle.toUpperCase(), 110);
  doc.text(splitTitle, 22, 70);

  const titleHeight = (splitTitle.length - 1) * 7;
  const currentY = 78 + titleHeight;

  // Grid de Info del Evento (Columna Izquierda)
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  
  doc.text('FECHA DEL SHOW', 22, currentY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(eventDate, 22, currentY + 6);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('HORA DE APERTURA', 85, currentY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(eventTime, 85, currentY + 6);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('LUGAR / VENUE', 22, currentY + 17);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  const splitVenue = doc.splitTextToSize(eventVenue, 110);
  doc.text(splitVenue, 22, currentY + 23);

  // 4. Sección Código QR (A la derecha de la tarjeta)
  let qrPngData = null;
  if (qrSvgElement) {
    qrPngData = await svgToPngDataUrl(qrSvgElement);
  }
  
  // Marco del QR
  doc.setFillColor(255, 255, 255);
  doc.rect(142, 54, 46, 46, 'F');

  if (qrPngData) {
    doc.addImage(qrPngData, 'PNG', 144, 56, 42, 42);
  } else {
    // Si no hay elemento QR, dibujar placeholder decorativo de QR
    doc.setFillColor(8, 9, 13);
    doc.rect(145, 57, 40, 40, 'F');
    doc.setTextColor(0, 255, 159);
    doc.setFontSize(8);
    doc.text('QR VALIDADOR', 165, 78, { align: 'center' });
  }

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('MOSTRÁ ESTE QR EN LA PUERTA', 165, 105, { align: 'center' });

  // Línea divisoria interna
  doc.setDrawColor(30, 41, 59);
  doc.line(22, 125, 188, 125);

  // Datos del Titular
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TITULAR DE LA ENTRADA', 22, 133);
  doc.setTextColor(0, 255, 159);
  doc.setFontSize(11);
  doc.text(titularName, 22, 139);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('CANTIDAD', 110, 133);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(`${cantidad} Ticket(s)`, 110, 139);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('REF. TICKET', 155, 133);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`${orderId}-01`, 155, 139);

  // 5. Detalles de Compra / Pago
  doc.setFillColor(18, 20, 28);
  doc.rect(15, 160, 180, 52, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.rect(15, 160, 180, 52, 'S');

  doc.setTextColor(0, 255, 159);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RESUMEN DE COMPRA', 22, 171);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Email de contacto: ${titularEmail || 'No especificado'}`, 22, 180);
  doc.text(`Método de Pago: ${metodoPago}`, 22, 187);

  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL ABONADO:', 125, 187);
  doc.setTextColor(0, 255, 159);
  doc.setFontSize(14);
  doc.text(`$${totalMonto.toLocaleString('es-AR')}`, 188, 187, { align: 'right' });

  // 6. Cuadro de Validez Física en Puerta (Criterio de Aceptación)
  doc.setFillColor(0, 255, 159, 0.05); // Tono tenue neón
  doc.setDrawColor(0, 255, 159);
  doc.setLineWidth(0.6);
  doc.rect(15, 220, 180, 38, 'DF');

  doc.setTextColor(0, 255, 159);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DOCUMENTO CON VALIDEZ FÍSICA PARA EL INGRESO', 22, 230);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Este comprobante PDF otorga acceso físico directo en la puerta del evento.', 22, 238);
  doc.text('• Podés presentar este archivo desde la pantalla de tu celular o llevarlo impreso.', 22, 244);
  doc.text('• Es obligatorio presentar DNI del titular en la entrada si el personal del evento lo requiere.', 22, 250);

  // 7. Pie de página
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('VOY PROJECT TICKETS • VOYPROJECT.AR • PLATAFORMA OFICIAL DE EVENTOS UNDERGROUND', 105, 280, { align: 'center' });

  // Guardar archivo PDF
  doc.save(`Entrada_VOY_${orderId}.pdf`);
};
