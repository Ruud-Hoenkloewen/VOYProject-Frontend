import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { fetchEventById, createEvent, updateEvent } from "../../services/eventService";
import { MapPinIcon, TrashIcon, PlusIcon, CalendarIcon, TicketIcon, DiscIcon, EyeIcon, PeopleIcon, DollarIcon } from "../../components/icons";
import EventMapPreview from "../../components/EventMapPreview/EventMapPreview";
import styles from "./EventFormPage.module.css";

import { fetchRegisteredArtists } from "../../services/userService";

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
    precio: "",
    capacidadTotal: "",
    descripcion: "",
    imagen: "",
  });

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState("");
  const [artists, setArtists] = useState([{ nombre: "", headliner: true }]);
  const [registeredArtists, setRegisteredArtists] = useState([]);
  const [flyerPreview, setFlyerPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRegisteredArtists()
      .then(data => setRegisteredArtists(data || []))
      .catch(err => console.error("Error cargando lista de artistas:", err));
  }, []);
  
  // Geocoding simulation state
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const geocodeTimeout = useRef(null);

  // Date and Time inputs ref
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Section completion status
  const isInfoComplete = form.nombre.trim() !== "" && form.fecha !== "" && form.hora !== "";
  const isVenueComplete = form.lugar.trim() !== "";
  const isTicketsComplete = (form.precio !== "" && Number(form.precio) >= 0) && (form.capacidadTotal !== "" && Number(form.capacidadTotal) > 0);
  const isLineupComplete = artists.some(art => art.nombre.trim() !== "");
  const isFlyerComplete = Boolean(flyerPreview);
  const isGenresComplete = selectedGenres.length > 0;
  const isDescComplete = form.descripcion.trim() !== "";

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
    const matched = registeredArtists.find(a => 
      (a.nombre || '').toLowerCase() === value.toLowerCase().trim() || 
      (a.username || '').toLowerCase() === value.toLowerCase().trim()
    );

    setArtists(prev => prev.map((art, idx) => {
      if (idx !== index) return art;
      return { 
        ...art, 
        nombre: value,
        usuario: matched ? matched._id : art.usuario,
        username: matched ? matched.username : art.username
      };
    }));
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
      // Filter out empty artist rows and map to registered users
      const cleanArtists = artists
        .filter(art => art.nombre.trim() !== "")
        .map(art => {
          const matched = registeredArtists.find(a => 
            (a.nombre || '').toLowerCase() === art.nombre.trim().toLowerCase() ||
            (a.username || '').toLowerCase() === art.nombre.trim().toLowerCase()
          );
          return {
            nombre: art.nombre.trim(),
            headliner: Boolean(art.headliner),
            usuario: art.usuario || (matched ? matched._id : null),
            username: art.username || (matched ? matched.username : null)
          };
        });

      const numPrecio = form.precio === "" ? 0 : Number(form.precio);
      const numCapacidad = form.capacidadTotal === "" ? 100 : Number(form.capacidadTotal);

      const payload = {
        nombre: form.nombre,
        imagen: form.imagen,
        generos: selectedGenres,
        fecha: new Date(form.fecha),
        hora: form.hora,
        lugar: form.lugar,
        precio: numPrecio,
        descripcion: form.descripcion,
        artistas: cleanArtists,
        capacidadTotal: numCapacidad,
        stock: numCapacidad,
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
              <div id="sec-info" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isInfoComplete ? styles.badgeSuccess : styles.badgeCyan}`}>
                    {isInfoComplete ? '✓' : '01'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <CalendarIcon size={16} color="var(--ds-color-cyan-400)" /> Información Básica
                    </h2>
                    <p className={styles.sectionSubtitle}>Nombre, fecha y horario de inicio del show</p>
                  </div>
                </div>

                <div className={styles.field} style={{ marginBottom: "20px" }}>
                  <label className={styles.label} htmlFor="nombre">
                    Nombre del Evento <span className={styles.requiredStar}>*</span>
                  </label>
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
                    <label className={styles.label} htmlFor="fecha">
                      Fecha <span className={styles.requiredStar}>*</span>
                    </label>
                    <input 
                      ref={dateInputRef}
                      id="fecha"
                      type="date" 
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      className={`${styles.input} ${styles.pickerInput} ${errors.fecha ? styles.inputError : ""}`}
                    />
                    {errors.fecha && <span className={styles.errorMsg}>{errors.fecha}</span>}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="hora">
                      Hora <span className={styles.requiredStar}>*</span>
                    </label>
                    <input 
                      ref={timeInputRef}
                      id="hora"
                      type="time" 
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                      className={`${styles.input} ${styles.pickerInput} ${errors.hora ? styles.inputError : ""}`}
                    />
                    {errors.hora && <span className={styles.errorMsg}>{errors.hora}</span>}
                  </div>
                </div>
              </div>

              {/* Sección 2: Lugar e Ubicación */}
              <div id="sec-venue" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isVenueComplete ? styles.badgeSuccess : styles.badgePurple}`}>
                    {isVenueComplete ? '✓' : '02'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <MapPinIcon size={16} color="#A855F7" /> Ubicación y Venue
                    </h2>
                    <p className={styles.sectionSubtitle}>Dirección del lugar y vista previa interactiva en mapa</p>
                  </div>
                </div>

                <div className={styles.field} style={{ marginBottom: "20px" }}>
                  <label className={styles.label} htmlFor="lugar">
                    Dirección / Lugar <span className={styles.requiredStar}>*</span>
                  </label>
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

                {/* Vista Previa del Mapa Interactivo */}
                <div className={styles.field}>
                  <label className={styles.label}>Vista Previa del Mapa Interactivo</label>
                  <EventMapPreview venue={form.lugar} height={220} showDirectionsBtn={false} />
                </div>
              </div>

              {/* Sección 3: Precio y Capacidad */}
              <div id="sec-tickets" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isTicketsComplete ? styles.badgeSuccess : styles.badgeLime}`}>
                    {isTicketsComplete ? '✓' : '03'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <DollarIcon size={16} color="#00FF9F" /> Entradas y Stock
                    </h2>
                    <p className={styles.sectionSubtitle}>Establecé el precio individual y la cantidad disponible de tickets</p>
                  </div>
                </div>

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
              <div id="sec-lineup" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isLineupComplete ? styles.badgeSuccess : styles.badgeCyan}`}>
                    {isLineupComplete ? '✓' : '04'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <PeopleIcon size={16} color="var(--ds-color-cyan-400)" /> Lineup de Artistas <span className={styles.requiredStar}>*</span>
                    </h2>
                    <p className={styles.sectionSubtitle}>Agregá las bandas participantes y destacá al headliner principal</p>
                  </div>
                </div>

                <div className={styles.artistsList}>
                  {artists.map((artist, idx) => (
                    <div key={idx} className={styles.artistRow}>
                      <div className={styles.field} style={{ flex: 1, gap: 0 }}>
                        <input 
                          type="text" 
                          list="registered-artists-list"
                          placeholder="Nombre del artista / banda"
                          value={artist.nombre}
                          onChange={(e) => handleArtistNameChange(idx, e.target.value)}
                          className={styles.input}
                          autoComplete="off"
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

                  <datalist id="registered-artists-list">
                    {registeredArtists.map((a) => (
                      <option key={a._id || a.username} value={a.nombre}>
                        {a.username ? `@${a.username}` : ''} {a.lema ? `- ${a.lema}` : ''}
                      </option>
                    ))}
                  </datalist>
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
              <div id="sec-flyer" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isFlyerComplete ? styles.badgeSuccess : styles.badgePink}`}>
                    {isFlyerComplete ? '✓' : '05'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <EyeIcon size={16} color="#FF007A" /> Imagen / Flyer
                    </h2>
                    <p className={styles.sectionSubtitle}>Subí la gráfica oficial o seleccioná un flyer preset</p>
                  </div>
                </div>

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
                      <EyeIcon size={28} color="var(--ds-color-cyan-400)" />
                      <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--ds-color-text-secondary)" }}>
                        Seleccionar Flyer del Show
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--ds-color-text-muted)" }}>Formatos recomendados: JPG, PNG</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className={styles.fileInput} 
                        onChange={handleFileChange} 
                      />
                    </label>
                  )}

                  {/* Preset Flyers selection */}
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                      O SELECCIONÁ UN FLYER PRESET:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {[
                        '/flyer-danny-proyectil.png',
                        '/flyer-sabbath-fest.png',
                        '/flyer-lacrifagia.png',
                        '/flyer-las-cosas-inexplicables.png'
                      ].map((presetUrl, pIdx) => (
                        <div 
                          key={pIdx}
                          onClick={() => {
                            setForm(prev => ({ ...prev, imagen: presetUrl }));
                            setFlyerPreview(presetUrl);
                          }}
                          style={{
                            height: '56px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: flyerPreview === presetUrl ? '2px solid #00FF9F' : '1px solid rgba(255,255,255,0.1)',
                            opacity: flyerPreview === presetUrl ? 1 : 0.7
                          }}
                        >
                          <img src={presetUrl} alt={`Preset ${pIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                      URL DE LA IMAGEN (OPCIONAL):
                    </span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.imagen}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(prev => ({ ...prev, imagen: val }));
                        setFlyerPreview(val);
                      }}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Sección 6: Géneros Musicales */}
              <div id="sec-genres" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isGenresComplete ? styles.badgeSuccess : styles.badgePurple}`}>
                    {isGenresComplete ? '✓' : '06'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <DiscIcon size={16} color="#A855F7" /> Géneros Musicales
                    </h2>
                    <p className={styles.sectionSubtitle}>Etiquetá los estilos musicales de tu evento</p>
                  </div>
                </div>

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
              <div id="sec-desc" className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={`${styles.sectionBadge} ${isDescComplete ? styles.badgeSuccess : styles.badgeLime}`}>
                    {isDescComplete ? '✓' : '07'}
                  </span>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <PlusIcon size={16} color="#00FF9F" /> Descripción del Show
                    </h2>
                    <p className={styles.sectionSubtitle}>Información adicional, condiciones de ingreso y detalles</p>
                  </div>
                </div>

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

          {/* Form Actions with Integrated Stepper Progress Bar */}
          <div className={styles.submitRow}>
            {/* Left: Section Progress Tracker */}
            <div className={styles.stepperTrack}>
              <a href="#sec-info" className={`${styles.trackerItem} ${isInfoComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>01</span> Info Básica {isInfoComplete ? '✓' : <span className={styles.requiredStar}>*</span>}
              </a>
              <a href="#sec-venue" className={`${styles.trackerItem} ${isVenueComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>02</span> Ubicación {isVenueComplete ? '✓' : <span className={styles.requiredStar}>*</span>}
              </a>
              <a href="#sec-tickets" className={`${styles.trackerItem} ${isTicketsComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>03</span> Entradas {isTicketsComplete ? '✓' : ''}
              </a>
              <a href="#sec-lineup" className={`${styles.trackerItem} ${isLineupComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>04</span> Lineup {isLineupComplete ? '✓' : <span className={styles.requiredStar}>*</span>}
              </a>
              <a href="#sec-flyer" className={`${styles.trackerItem} ${isFlyerComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>05</span> Flyer {isFlyerComplete ? '✓' : ''}
              </a>
              <a href="#sec-genres" className={`${styles.trackerItem} ${isGenresComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>06</span> Géneros {isGenresComplete ? '✓' : ''}
              </a>
              <a href="#sec-desc" className={`${styles.trackerItem} ${isDescComplete ? styles.trackerItemCompleted : ""}`}>
                <span className={styles.navNum}>07</span> Descripción {isDescComplete ? '✓' : ''}
              </a>
            </div>

            {/* Right: Action Buttons */}
            <div className={styles.actionBtns}>
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
