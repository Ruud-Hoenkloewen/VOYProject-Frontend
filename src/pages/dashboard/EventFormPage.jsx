import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { fetchEventById, createEvent, updateEvent } from "../../services/eventService";
import { MapPinIcon, TrashIcon, PlusIcon } from "../../components/icons";
import styles from "./EventFormPage.module.css";

const DEFAULT_GENRES = ["Punk", "Rock", "Metal", "Hardcore", "Post-Hardcore", "Grunge", "Post-Punk", "Noise Rock", "Shoegaze", "Indie"];

export default function EventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Form State
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    lugar: "",
    precio: 0,
    capacidadTotal: 100,
    descripcion: "",
    imagen: "",
  });

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState("");
  const [artists, setArtists] = useState([{ nombre: "", headliner: true }]);
  const [flyerPreview, setFlyerPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, error: boolean }
  
  // Geocoding simulation state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const geocodeTimeout = useRef(null);

  const showToastMsg = (message, isError = false) => {
    setToast({ message, error: isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load event details in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      loadEventDetails();
    }
  }, [id]);

  const loadEventDetails = async () => {
    try {
      setFetching(true);
      const data = await fetchEventById(id);
      
      // Format date to YYYY-MM-DD for date input
      let formattedDate = "";
      if (data.date) {
        // En caso de que venga normalizado por el frontend "28 JUN 2026",
        // intentamos mapearlo de vuelta, o si tenemos la fecha original:
        // Buscamos si la fecha del backend original es ISO string
        // Como fetchEventById devuelve el mapEvent ya normalizado, podemos 
        // hacer un pequeño workaround o parsear la fecha de vuelta a YYYY-MM-DD
        const parsedDate = new Date(data.date);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toISOString().split("T")[0];
        }
      }

      setForm({
        nombre: data.title || "",
        fecha: formattedDate || "",
        hora: data.time ? data.time.replace(" HS", "") : "",
        lugar: data.venue || "",
        precio: data.rawPrice ?? 0,
        capacidadTotal: data.capacity ?? 100,
        descripcion: data.description || "",
        imagen: data.imageUrl || "",
      });

      setSelectedGenres(data.genres || []);
      setArtists(data.artists && data.artists.length > 0 ? data.artists : [{ nombre: "", headliner: true }]);
      setFlyerPreview(data.imageUrl || "");
      setMapAddress(data.venue || "");
    } catch (err) {
      console.error(err);
      showToastMsg("Error al cargar los detalles del evento.", true);
    } finally {
      setFetching(false);
    }
  };

  // Handle inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "precio" || name === "capacidadTotal" ? parseInt(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Trigger geocoding animation when Address changes
    if (name === "lugar") {
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
      setIsGeocoding(true);
      geocodeTimeout.current = setTimeout(() => {
        setIsGeocoding(false);
        setMapAddress(value);
      }, 1200);
    }
  };

  // Genres handling
  const handleToggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(prev => prev.filter(g => g !== genre));
    } else {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  const handleAddCustomGenre = (e) => {
    e.preventDefault();
    const clean = customGenre.trim();
    if (!clean) return;
    if (!selectedGenres.includes(clean)) {
      setSelectedGenres(prev => [...prev, clean]);
    }
    setCustomGenre("");
  };

  // Artists handling
  const handleArtistNameChange = (index, value) => {
    setArtists(prev => prev.map((art, idx) => idx === index ? { ...art, nombre: value } : art));
  };

  const handleArtistHeadlinerChange = (index, isChecked) => {
    setArtists(prev => prev.map((art, idx) => idx === index ? { ...art, headliner: isChecked } : art));
  };

  const handleAddArtist = (e) => {
    e.preventDefault();
    setArtists(prev => [...prev, { nombre: "", headliner: false }]);
  };

  const handleRemoveArtist = (index) => {
    if (artists.length <= 1) return;
    setArtists(prev => prev.filter((_, idx) => idx !== index));
  };

  // Photo Uploader & Base64 Converter
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview URL locally
    const objectUrl = URL.createObjectURL(file);
    setFlyerPreview(objectUrl);

    // Convert file to Base64 to save on the backend
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFlyer = (e) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, imagen: "" }));
    setFlyerPreview("");
  };

  // Validation
  const validateForm = () => {
    const nextErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = "El nombre del evento es obligatorio";
    if (!form.fecha) nextErrors.fecha = "La fecha del evento es obligatoria";
    if (!form.hora) nextErrors.hora = "La hora del evento es obligatoria";
    if (!form.lugar.trim()) nextErrors.lugar = "El lugar del evento es obligatorio";
    
    // Check dynamic artists
    const hasArtistNames = artists.some(art => art.nombre.trim() !== "");
    if (!hasArtistNames) {
      nextErrors.artists = "Debe ingresar al menos un artista";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToastMsg("Por favor, corrija los campos requeridos.", true);
      return;
    }

    setLoading(true);
    try {
      // Filter out empty artist rows
      const cleanArtists = artists.filter(art => art.nombre.trim() !== "");

      const payload = {
        nombre: form.nombre,
        imagen: form.imagen,
        generos: selectedGenres,
        fecha: new Date(form.fecha),
        hora: form.hora,
        lugar: form.lugar,
        precio: form.precio,
        descripcion: form.descripcion,
        artistas: cleanArtists,
        capacidadTotal: form.capacidadTotal,
        stock: form.capacidadTotal, // Initial stock equals total capacity
      };

      if (isEditMode) {
        await updateEvent(id, payload);
        showToastMsg("Evento actualizado con éxito");
      } else {
        await createEvent(payload);
        showToastMsg("Evento publicado con éxito");
      }

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard/producer");
      }, 1500);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.mensaje || "Error al guardar el evento.";
      showToastMsg(msg, true);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.root}>
        <EditorialHeader />
        <Container>
          <div style={{ textAlign: "center", padding: "100px 0", color: "#666" }}>
            Cargando detalles del evento para edición...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <EditorialHeader />

      <Container>
        {/* Header */}
        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
            <span className={styles.eyebrow}>FORMULARIO DE SHOW</span>
            <h1 className={styles.title}>{isEditMode ? "Editar Evento" : "Crear Nuevo Evento"}</h1>
          </div>
          <Link to="/dashboard/producer" className={styles.backBtn}>
            &larr; Volver al Panel
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            
            {/* Left Column: Form Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Sección 1: Información Básica */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>ℹ️</span> Información Básica
                </h2>

                <div className={styles.field} style={{ marginBottom: "20px" }}>
                  <label className={styles.label} htmlFor="nombre">Nombre del Evento *</label>
                  <input 
                    id="nombre"
                    type="text" 
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
                    placeholder="Ej. Festival Tucumán Hardcore"
                  />
                  {errors.nombre && <span className={styles.errorMsg}>{errors.nombre}</span>}
                </div>

                <div className={styles.fieldGroup} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="fecha">Fecha *</label>
                    <input 
                      id="fecha"
                      type="date" 
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.fecha ? styles.inputError : ""}`}
                    />
                    {errors.fecha && <span className={styles.errorMsg}>{errors.fecha}</span>}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="hora">Hora *</label>
                    <input 
                      id="hora"
                      type="time" 
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.hora ? styles.inputError : ""}`}
                    />
                    {errors.hora && <span className={styles.errorMsg}>{errors.hora}</span>}
                  </div>
                </div>
              </div>

              {/* Sección 2: Lugar e Ubicación */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>📍</span> Ubicación y Venue
                </h2>

                <div className={styles.field} style={{ marginBottom: "20px" }}>
                  <label className={styles.label} htmlFor="lugar">Dirección / Lugar *</label>
                  <input 
                    id="lugar"
                    type="text" 
                    name="lugar"
                    value={form.lugar}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.lugar ? styles.inputError : ""}`}
                    placeholder="Ej. Oskar Bar, Virgen de la Merced 611, Tucumán"
                  />
                  {errors.lugar && <span className={styles.errorMsg}>{errors.lugar}</span>}
                </div>

                {/* Simulated Geocoding Map */}
                <div className={styles.field}>
                  <label className={styles.label}>Vista Previa del Mapa</label>
                  <div className={styles.mapWrapper}>
                    <div className={styles.radarGrid} />
                    {isGeocoding ? (
                      <div style={{ color: "var(--ds-color-cyan-400)", fontSize: "11px", fontWeight: "900", fontFamily: "var(--ds-font-family-mono)", zIndex: 3 }}>
                        GEOCODIFICANDO DIRECCIÓN...
                      </div>
                    ) : mapAddress ? (
                      <>
                        <div className={styles.radarCircle} />
                        <div className={styles.radarCircle} style={{ animationDelay: "1s" }} />
                        <div className={styles.mapPin}>
                          <MapPinIcon size={32} color="var(--ds-color-state-danger)" />
                        </div>
                        <span className={styles.mapLabel}>{mapAddress}</span>
                      </>
                    ) : (
                      <span style={{ color: "#444", fontSize: "12px" }}>Escribí un lugar para centrar el mapa</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 3: Precio y Capacidad */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>💵</span> Entradas y Stock
                </h2>

                <div className={styles.fieldGroup} style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="precio">Precio de la Entrada ($)</label>
                    <input 
                      id="precio"
                      type="number" 
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      className={styles.input}
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="capacidadTotal">Capacidad Total (Stock)</label>
                    <input 
                      id="capacidadTotal"
                      type="number" 
                      name="capacidadTotal"
                      value={form.capacidadTotal}
                      onChange={handleChange}
                      className={styles.input}
                      min="1"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Artistas (Dinámica) */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>🎸</span> Lineup de Artistas
                </h2>

                <div className={styles.artistsList}>
                  {artists.map((artist, idx) => (
                    <div key={idx} className={styles.artistRow}>
                      <div className={styles.field} style={{ flex: 1, gap: 0 }}>
                        <input 
                          type="text" 
                          placeholder="Nombre del artista / banda"
                          value={artist.nombre}
                          onChange={(e) => handleArtistNameChange(idx, e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      
                      <label className={styles.headlinerCheck}>
                        <input 
                          type="checkbox"
                          checked={artist.headliner}
                          onChange={(e) => handleArtistHeadlinerChange(idx, e.target.checked)}
                          className={styles.checkbox}
                        />
                        <span>Headliner</span>
                      </label>

                      <button 
                        type="button" 
                        className={styles.deleteArtistBtn}
                        onClick={() => handleRemoveArtist(idx)}
                        disabled={artists.length <= 1}
                        title="Eliminar artista"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {errors.artists && <div className={styles.errorMsg} style={{ marginTop: "10px" }}>{errors.artists}</div>}

                <button 
                  type="button" 
                  className={styles.addArtistBtn} 
                  style={{ marginTop: "16px" }}
                  onClick={handleAddArtist}
                >
                  + Agregar Artista al Lineup
                </button>
              </div>

            </div>

            {/* Right Column: Photo & Genres */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Sección 5: Flyer / Foto */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>🖼️</span> Imagen / Flyer
                </h2>

                <div className={styles.field}>
                  {flyerPreview ? (
                    <div className={styles.previewWrapper}>
                      <img src={flyerPreview} alt="Flyer Preview" className={styles.previewImg} />
                      <button 
                        type="button" 
                        className={styles.removePreviewBtn} 
                        onClick={handleRemoveFlyer}
                        title="Quitar flyer"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label className={styles.uploadContainer}>
                      <span style={{ fontSize: "32px" }}>📸</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#666" }}>
                        Seleccionar Flyer del Show
                      </span>
                      <span style={{ fontSize: "10px", color: "#444" }}>Formatos recomendados: JPG, PNG</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className={styles.fileInput} 
                        onChange={handleFileChange} 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Sección 6: Géneros Musicales */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>🔊</span> Géneros Musicales
                </h2>

                <div className={styles.genresSection}>
                  <div className={styles.tagsGrid}>
                    {DEFAULT_GENRES.map((g) => {
                      const isActive = selectedGenres.includes(g);
                      return (
                        <span 
                          key={g} 
                          className={`${styles.tag} ${isActive ? styles.tagActive : ""}`}
                          onClick={() => handleToggleGenre(g)}
                        >
                          {g}
                        </span>
                      );
                    })}
                    {/* Render custom user selected genres not in defaults */}
                    {selectedGenres.filter(g => !DEFAULT_GENRES.includes(g)).map((g) => (
                      <span 
                        key={g} 
                        className={`${styles.tag} ${styles.tagActive}`}
                        onClick={() => handleToggleGenre(g)}
                      >
                        {g} &times;
                      </span>
                    ))}
                  </div>

                  <div className={styles.addTagRow} style={{ marginTop: "12px" }}>
                    <input 
                      type="text" 
                      placeholder="Nuevo género"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      className={styles.input}
                      style={{ padding: "8px 12px", fontSize: "13px" }}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomGenre}
                      className={styles.addTagBtn}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección 7: Descripción */}
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  <span>📝</span> Descripción del Show
                </h2>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="descripcion">Detalles del evento</label>
                  <textarea 
                    id="descripcion"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Contanos un poco de qué se trata el ciclo, bandas invitadas, condiciones de acceso..."
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Form Actions */}
          <div className={styles.submitRow}>
            <Link to="/dashboard/producer" className={styles.cancelBtn}>
              Cancelar
            </Link>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "GUARDANDO..." : isEditMode ? "GUARDAR CAMBIOS" : "PUBLICAR EVENTO"}
            </button>
          </div>
        </form>
      </Container>

      {/* Toast Feedback */}
      {toast && (
        <div className={styles.toastContainer}>
          <div className={`${styles.toast} ${toast.error ? styles.toastError : ""}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
