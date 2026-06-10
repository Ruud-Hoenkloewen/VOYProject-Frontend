
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEventById } from '../../services/eventService';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import styles from './CheckoutFormPage.module.css';

/**
 * CheckoutFormPage — Paso 2: Tus datos
 * Ruta: /events/:id/checkout/datos
 */
export default function CheckoutFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [eventData, setEventData] = useState(location.state?.eventData ?? null);
  const [cantidad, setCantidad] = useState(location.state?.cantidad ?? 1);
  const [loading, setLoading] = useState(!eventData);

  // Inicializa el formulario con datos previos si existen (al presionar VOLVER desde paso 3)
  const [form, setForm] = useState({
    nombre: location.state?.compradorData?.nombre ?? '',
    apellido: location.state?.compradorData?.apellido ?? '',
    email: location.state?.compradorData?.email ?? '',
    dni: location.state?.compradorData?.dni ?? '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!eventData && id) {
      fetchEventById(id)
        .then(setEventData)
        .catch(() => navigate('/', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [id, eventData, navigate]);

  function handleChange(e) {
    let { name, value } = e.target;

    // DNI: solo números
    if (name === 'dni') {
      value = value.replace(/\D/g, '');
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error mientras escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    const errs = validate();

    setErrors((prev) => ({
      ...prev,
      [name]: errs[name] || '',
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.nombre.trim()) {
      nextErrors.nombre = 'El nombre es requerido';
    }

    if (!form.apellido.trim()) {
      nextErrors.apellido = 'El apellido es requerido';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'El formato del email es inválido';
    }

    if (!form.dni.trim()) {
      nextErrors.dni = 'El DNI es requerido';
    } else if (!/^\d+$/.test(form.dni)) {
      nextErrors.dni = 'Solo se aceptan números';
    }

    return nextErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Navegar al paso 3 (pago) pasando la información del comprador
    navigate(`/events/${id}/checkout/pago`, {
      state: {
        eventData,
        cantidad,
        compradorData: form,
      },
    });
  }

  function handleVolver() {
    // Volver al paso 1 (entradas) conservando los datos
    navigate(`/events/${id}/checkout`, {
      state: {
        eventData,
        cantidad,
        compradorData: form,
      },
    });
  }

  if (loading) {
    return (
      <div className={styles.loadingRoot}>
        <div className={styles.loadingPulse} />
      </div>
    );
  }

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <CheckoutLayout
      currentStep={2}
      eventData={eventData}
      cantidad={cantidad}
    >
      <div className={styles.stepCard}>
        {/* Título */}
        <div className={styles.stepHeader}>
          <span className={styles.stepIcon}>👤</span>
          <h1 className={styles.stepTitle}>TUS DATOS</h1>
        </div>

        <p className={styles.stepSubtitle}>
          Usaremos estos datos para enviar tu entrada
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            {/* Nombre */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="nombre">
                NOMBRE
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Ramiro"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${
                  errors.nombre ? styles.inputError : ''
                }`}
              />

              {errors.nombre && (
                <span className={styles.errorMsg}>{errors.nombre}</span>
              )}
            </div>

            {/* Apellido */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="apellido">
                APELLIDO
              </label>

              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Ej. Gómez"
                value={form.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${
                  errors.apellido ? styles.inputError : ''
                }`}
              />

              {errors.apellido && (
                <span className={styles.errorMsg}>{errors.apellido}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              CORREO ELECTRÓNICO
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="vos@email.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ''
              }`}
            />

            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          {/* DNI */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dni">
              DNI
            </label>

            <input
              id="dni"
              name="dni"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="12.345.678"
              value={form.dni}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${
                errors.dni ? styles.inputError : ''
              }`}
            />

            {errors.dni && (
              <span className={styles.errorMsg}>{errors.dni}</span>
            )}
          </div>

          {/* Acciones */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={handleVolver}
            >
              VOLVER
            </button>

            <button
              type="submit"
              className={styles.ctaBtn}
              disabled={!isFormValid}
            >
              CONTINUAR AL PAGO →
            </button>
          </div>
        </form>
      </div>
    </CheckoutLayout>
  );
}