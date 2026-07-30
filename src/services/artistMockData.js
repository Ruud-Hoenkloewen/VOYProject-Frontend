/**
 * Mock Data para el Perfil de Artista, Canciones, Eventos e Interacciones.
 * Se utiliza como contingencia cuando el backend no tiene endpoints/tablas activas.
 */

export const MOCK_ARTISTS = [
  {
    _id: "artist-los-supresores",
    id: "artist-los-supresores",
    nombre: "Los Supresores",
    nombreArtistico: "Los Supresores",
    username: "lossupresores",
    role: "artist",
    rol: "artist",
    tags: ["artista", "punk", "hardcore", "tucuman"],
    bio: "Banda de Punk & Hardcore directo desde San Miguel de Tucumán. Distorsión cruda, ritmo frenético y líricas de la calle desde 2019.",
    avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    avatarColor: "#FF2D78",
    bannerGradiente: "g4",
    bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    ubicacion: "San Miguel de Tucumán, Argentina",
    generosMusicales: ["PUNK", "HARDCORE", "ROCK"],
    vibeEnShows: ["Pogo", "Mosh pit", "Cerveza en mano"],
    seguidores: ["user-1", "user-2", "user-3", "user-4", "user-5"],
    siguiendo: ["artist-kroma-noise", "artist-subversivos"],
    seguidoresCount: 342,
    siguiendoCount: 45,
    isFollowing: false,
    redesSociales: {
      instagram: "lossupresores.punk",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      web: "https://lossupresores.com"
    },
    tracks: [
      {
        id: "track-1",
        artistId: "artist-los-supresores",
        title: "Ruido sordo en la noche",
        album: "Distorsión Colectiva (EP)",
        duration: "2:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&q=80",
        playsCount: 14200,
        releaseDate: "2025-11-10"
      },
      {
        id: "track-2",
        artistId: "artist-los-supresores",
        title: "Sin Frenos ni Destino",
        album: "Distorsión Colectiva (EP)",
        duration: "3:12",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&q=80",
        playsCount: 9800,
        releaseDate: "2025-11-10"
      },
      {
        id: "track-3",
        artistId: "artist-los-supresores",
        title: "Bajo la Lluvia Ácida",
        album: "Single",
        duration: "3:01",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80",
        playsCount: 22100,
        releaseDate: "2026-02-14"
      }
    ],
    events: [
      {
        id: "evt-101",
        title: "TUCUMÁN PUNK FEST VI",
        date: "2026-08-15",
        time: "22:00 HS",
        venue: "El Galpón Cultural",
        city: "San Miguel de Tucumán",
        ticketUrl: "/events/1",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
        roleInEvent: "Banda Principal"
      },
      {
        id: "evt-102",
        title: "NOCHE SUBTERRÁNEA HARDCORE",
        date: "2026-09-02",
        time: "23:30 HS",
        venue: "Magic Music Box",
        city: "San Miguel de Tucumán",
        ticketUrl: "/events/2",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        roleInEvent: "Co-Estelar"
      }
    ],
    interactions: [
      {
        id: "inter-1",
        artistId: "artist-los-supresores",
        authorName: "Los Supresores",
        authorAvatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
        authorHandle: "@lossupresores",
        authorRole: "ARTISTA",
        type: "announcement",
        content: "🔥¡ATENCIÓN TUCUMÁN! Ya podés conseguir las anticipadas para el PUNK FEST VI en El Galpón. Quedan muy pocas entradas en preventa 1. Nos vemos en el pogo! 🤘",
        mediaUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
        likesCount: 89,
        commentsCount: 14,
        timestamp: "Hace 2 horas"
      },
      {
        id: "inter-2",
        artistId: "artist-los-supresores",
        authorName: "Los Supresores",
        authorAvatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
        authorHandle: "@lossupresores",
        authorRole: "ARTISTA",
        type: "release",
        content: "🎵 Lanzamos nuestro nuevo single 'Bajo la Lluvia Ácida'. Escuchalo ahora en Spotify y compartilo si banca el punk independiente!",
        mediaUrl: null,
        likesCount: 124,
        commentsCount: 22,
        timestamp: "Hace 3 días"
      }
    ]
  },

  {
    _id: "artist-kroma-noise",
    id: "artist-kroma-noise",
    nombre: "Kroma Noise",
    nombreArtistico: "Kroma Noise",
    username: "kromanoise",
    role: "artist",
    rol: "artist",
    tags: ["artista", "techno", "electronica", "tucuman"],
    bio: "Proyecto synthwave & techno analógico. Paisajes sonoros oscuros y frecuencias hipnóticas para noches eternas.",
    avatarUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
    avatarColor: "#00E5FF",
    bannerGradiente: "g3",
    bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    ubicacion: "Yerba Buena, Tucumán",
    generosMusicales: ["TECHNO", "ELECTRÓNICA", "SYNTHWAVE"],
    vibeEnShows: ["Dance floor", "Synth lover", "Noctámbulo"],
    seguidores: ["user-1", "user-3", "user-6"],
    siguiendo: ["artist-los-supresores"],
    seguidoresCount: 512,
    siguiendoCount: 18,
    isFollowing: true,
    redesSociales: {
      instagram: "kroma.noise",
      spotify: "https://spotify.com",
      soundcloud: "https://soundcloud.com"
    },
    tracks: [
      {
        id: "track-10",
        artistId: "artist-kroma-noise",
        title: "Frecuencia Nocturna",
        album: "Cyberpulse",
        duration: "5:20",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        playsCount: 31000,
        releaseDate: "2026-01-05"
      },
      {
        id: "track-11",
        artistId: "artist-kroma-noise",
        title: "Luces de Neón",
        album: "Cyberpulse",
        duration: "4:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        playsCount: 18400,
        releaseDate: "2026-01-05"
      }
    ],
    events: [
      {
        id: "evt-201",
        title: "NEON SYNTH SESSION",
        date: "2026-08-20",
        time: "01:00 HS",
        venue: "Club Isabel",
        city: "San Miguel de Tucumán",
        ticketUrl: "/events/3",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        roleInEvent: "Live Act Headliner"
      }
    ],
    interactions: [
      {
        id: "inter-10",
        artistId: "artist-kroma-noise",
        authorName: "Kroma Noise",
        authorAvatar: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
        authorHandle: "@kromanoise",
        authorRole: "ARTISTA",
        type: "post",
        content: "Preparando nuevo Live Set con modulares para la fecha del 20 en Club Isabel. ¿Qué BPMs quieren para el cierre? ⚡⚡",
        mediaUrl: null,
        likesCount: 67,
        commentsCount: 19,
        timestamp: "Ayer"
      }
    ]
  },

  {
    _id: "artist-subversivos",
    id: "artist-subversivos",
    nombre: "Subversivos",
    nombreArtistico: "Subversivos Metal",
    username: "subversivosmetal",
    role: "artist",
    rol: "artist",
    tags: ["artista", "metal", "thrash", "tucuman"],
    bio: "Metal Pesado & Thrash desde el cerro San Javier. Riffs poderosos y agresión en el escenario.",
    avatarUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=400&q=80",
    avatarColor: "#A044FF",
    bannerGradiente: "g2",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    ubicacion: "Tafí Viejo, Tucumán",
    generosMusicales: ["METAL", "HARDCORE", "GRUNGE"],
    vibeEnShows: ["Mosh pit", "Pogo", "Guitarrero"],
    seguidores: ["user-2", "user-4"],
    siguiendo: ["artist-los-supresores"],
    seguidoresCount: 289,
    siguiendoCount: 12,
    isFollowing: false,
    redesSociales: {
      instagram: "subversivos.metal",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com"
    },
    tracks: [
      {
        id: "track-20",
        artistId: "artist-subversivos",
        title: "Fuego en la Cumbre",
        album: "Furia del Cerro",
        duration: "4:15",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        spotifyUrl: "https://open.spotify.com",
        coverUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=300&q=80",
        playsCount: 8700,
        releaseDate: "2025-09-18"
      }
    ],
    events: [
      {
        id: "evt-301",
        title: "FESTIVAL METAL NORTE II",
        date: "2026-09-18",
        time: "21:00 HS",
        venue: "Club Sportivo Patria",
        city: "San Miguel de Tucumán",
        ticketUrl: "/events/4",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        roleInEvent: "Banda Principal"
      }
    ],
    interactions: [
      {
        id: "inter-20",
        artistId: "artist-subversivos",
        authorName: "Subversivos",
        authorAvatar: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=400&q=80",
        authorHandle: "@subversivosmetal",
        authorRole: "ARTISTA",
        type: "announcement",
        content: "🤘 Anunciamos nuestra presencia en el METAL NORTE II. Grabaremos nuestro primer DVD en vivo así que queremos un mosh épico!",
        mediaUrl: null,
        likesCount: 102,
        commentsCount: 15,
        timestamp: "Hace 5 días"
      }
    ]
  }
];
