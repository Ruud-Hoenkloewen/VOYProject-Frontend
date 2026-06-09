/**
 * userService — llamadas mockeadas a los endpoints de perfil de usuario.
 * Simula la obtención de perfiles desde el backend.
 */

// Retraso para simular llamada de red
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const GRADIENTS = {
  g1: "linear-gradient(90deg, #ff7bee, #00ff9f)", // Fucsia a Verde Lima
  g2: "linear-gradient(90deg, #22d3ee, #8b5cf6)", // Cyan a Violeta
  g3: "linear-gradient(135deg, #10121a, #ff7bee)", // Oscuro a Fucsia
  g4: "linear-gradient(90deg, #f97316, #ffd84e)", // Naranja a Amarillo
  g5: "linear-gradient(90deg, #f43f5e, #f97316)"  // Coral a Naranja
};

export const AVATAR_COLORS = [
  { name: "Verde Lima", value: "#a3e635" },
  { name: "Magenta", value: "#ff7bee" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Naranja", value: "#f97316" },
  { name: "Violeta", value: "#8b5cf6" },
  { name: "Coral", value: "#f43f5e" },
  { name: "Amarillo", value: "#ffd84e" },
  { name: "Gris", value: "#7a8094" }
];

/**
 * getProfileByUsername — busca y retorna los perfiles mockeados para diferentes roles
 * @param {string} username - Nombre de usuario
 * @returns {Promise<object>} Perfil de usuario o null si no se encuentra
 */
export const getProfileByUsername = async (username) => {
  await delay(400); // Simulamos latencia
  
  if (!username) return null;
  const formattedUsername = username.toLowerCase().trim();

  // Comprobar si coincide con el usuario actualmente logueado en la sesión de localStorage
  try {
    const rawUser = localStorage.getItem('voy_user');
    if (rawUser) {
      const loggedUser = JSON.parse(rawUser);
      // Generar slug del nombre del usuario logueado
      const loggedUsername = loggedUser.nombre ? loggedUser.nombre.toLowerCase().replace(/\s+/g, '') : '';
      if (formattedUsername === loggedUsername) {
        return {
          _id: loggedUser._id,
          nombre: loggedUser.nombre,
          username: loggedUsername,
          rol: "fan", // Por defecto los registrados en frontend son tipo fan
          bannerGradiente: loggedUser.bannerGradiente || null,
          avatarColor: loggedUser.avatarColor || "#22d3ee",
          bio: "¡Bienvenido/a a VOY! Editá tu perfil para contarnos un poco sobre tu pasión por la música.",
          ubicacion: "San Miguel de Tucumán, Argentina",
          redes: [],
          seguidoresCount: 0,
          siguiendoCount: 0,
          eventosGuardados: 0,
          generosFavoritos: 0
        };
      }
    }
  } catch (err) {
    console.error("Error al leer usuario logueado en userService:", err);
  }

  // Perfiles pre-configurados para demostración y testing
  if (formattedUsername === 'ironben04') {
    return {
      nombre: "IRONBEN04",
      username: "ironben04",
      rol: "fan",
      bannerGradiente: "linear-gradient(90deg, #10121a 0%, #242836 100%)",
      avatarColor: "#a3e635", // Verde limón (según mockup)
      bio: "Sin bio todavía. Editá tu perfil para contarle algo a la comunidad.",
      ubicacion: "San Miguel de Tucumán, Argentina",
      redes: [
        { plataforma: "instagram", url: "https://instagram.com/ironben04" },
        { plataforma: "twitter", url: "https://twitter.com/ironben04" }
      ],
      seguidoresCount: 12,
      siguiendoCount: 24,
      eventosGuardados: 0,
      generosFavoritos: 0
    };
  }

  if (formattedUsername === 'duki') {
    return {
      nombre: "Mauro Lombardo",
      username: "duki",
      rol: "artista",
      nombreArtistico: "Duki",
      generos: ["TRAP", "ROCK", "ALTERNATIVO"],
      bannerGradiente: "linear-gradient(90deg, #ff7bee 0%, #00ff9f 100%)",
      avatarColor: "#ff7bee", // Fucsia
      bio: "Desde el fin del mundo. Trayendo el trap de vuelta y apoyando el rock local.",
      ubicacion: "Almagro, Buenos Aires",
      redes: [
        { plataforma: "instagram", url: "https://instagram.com/duki" },
        { plataforma: "spotify", url: "https://open.spotify.com/artist/1Yj5paJWmUiHokFo24t3Pj" },
        { plataforma: "youtube", url: "https://youtube.com/duki" }
      ],
      seguidoresCount: 1420500,
      siguiendoCount: 420
    };
  }

  if (formattedUsername === 'labohemia') {
    return {
      nombre: "La Bohemia Producciones",
      username: "labohemia",
      rol: "productor",
      nombreProductora: "La Bohemia Producciones",
      bannerGradiente: "linear-gradient(135deg, #10121a 0%, #ff7bee 100%)",
      avatarColor: "#00ff9f", // Verde menta eléctrico
      bio: "Productora independiente de eventos de rock y punk en Tucumán. Apoyando el underground desde 2018.",
      ubicacion: "San Miguel de Tucumán, Argentina",
      redes: [
        { plataforma: "instagram", url: "https://instagram.com/la_bohemia_prod" },
        { plataforma: "twitter", url: "https://twitter.com/la_bohemia" }
      ],
      seguidoresCount: 1250,
      siguiendoCount: 180
    };
  }

  // Si no coincide con ninguno, devolvemos null para simular un 404
  return null;
};

/**
 * getMyProfile — obtiene el perfil del usuario logueado en la sesión
 * @returns {Promise<object>} Perfil de usuario o null si no está logueado
 */
export const getMyProfile = async () => {
  await delay(300);
  try {
    const rawUser = localStorage.getItem('voy_user');
    if (!rawUser) return null;
    const user = JSON.parse(rawUser);
    const username = user.nombre ? user.nombre.toLowerCase().replace(/\s+/g, '') : '';
    return getProfileByUsername(username);
  } catch (err) {
    console.error("Error al obtener mi perfil en userService:", err);
    return null;
  }
};

/**
 * updateMyProfile — actualiza los valores de personalización del usuario actual (PUT /api/users/me)
 * @param {string} avatarColor - Color en hex/css
 * @param {string} bannerGradiente - Clave del gradiente (g1, g2...) o CSS
 * @returns {Promise<object>} Respuesta del mock
 */
export const updateMyProfile = async (avatarColor, bannerGradiente) => {
  await delay(400); // Simulamos latencia
  try {
    const rawUser = localStorage.getItem('voy_user');
    if (!rawUser) throw new Error("No autenticado");
    const user = JSON.parse(rawUser);
    
    // Al confirmar, guarda avatarColor y bannerGradiente en localStorage
    user.avatarColor = avatarColor;
    user.bannerGradiente = bannerGradiente;
    localStorage.setItem('voy_user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (err) {
    console.error("Error al actualizar perfil en userService:", err);
    throw err;
  }
};
