/**
 * @typedef {Object} Artist
 * @property {string} nombre
 * @property {boolean} [headliner]
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} imageUrl
 * @property {string[]} genres
 * @property {string} date
 * @property {Date|null} [rawDate]
 * @property {string} time
 * @property {string} venue
 * @property {string} price
 * @property {number} rawPrice
 * @property {string} description
 * @property {Artist[]} artists
 * @property {string} status
 * @property {string} statusTone
 * @property {number|null} [capacity]
 * @property {number|null} [stock]
 */

/**
 * @typedef {'TODOS' | 'ROCK' | 'INDIE' | 'PUNK' | 'HARDCORE' | 'METAL' | 'GRUNGE' | 'SHOEGAZE' | 'FOLK' | 'POP' | 'ELECTRONICA' | 'TECHNO'} Genre
 */

/**
 * @typedef {'fecha_asc' | 'fecha_desc' | 'precio_asc' | 'precio_desc' | 'popular'} SortOption
 */

/**
 * @typedef {Object} FilterState
 * @property {string} searchText
 * @property {Genre} selectedGenre
 * @property {string} venue
 * @property {string} date
 * @property {SortOption} sortOrder
 */

export const GENRES_LIST = [
  "TODOS",
  "ROCK",
  "POST-ROCK",
  "HARDCORE",
  "GRUNGE",
  "POST-PUNK",
  "METAL",
  "STONER ROCK",
  "NOISE ROCK",
  "HEAVY ROCK",
  "INDIE ROCK",
  "ALTERNATICO"
];

export const MOCK_EVENTS = [
  {
    id: "mock-1",
    title: "DANNY PROYECTIL + BANDAS INVITADAS",
    imageUrl: "/flyer-danny-proyectil.png",
    genres: ["PUNK", "ROCK"],
    date: "14 AGO 2026",
    rawDate: new Date("2026-08-14"),
    time: "21:00 HS",
    venue: "Salon Pueyrredón",
    price: "$ 8.000",
    rawPrice: 8000,
    description: "Noche a puro punk rock en Palermo con Danny Proyectil.",
    artists: [{ nombre: "Danny Proyectil", headliner: true }],
    status: "DISPONIBLE",
    statusTone: "success",
    capacity: 300,
    stock: 120
  },
  {
    id: "mock-2",
    title: "LACRIFAGIA: NOCHE DE OBSCURIDAD",
    imageUrl: "/flyer-lacrifagia.png",
    genres: ["HARDCORE", "METAL"],
    date: "20 AGO 2026",
    rawDate: new Date("2026-08-20"),
    time: "22:00 HS",
    venue: "El Teatrito",
    price: "$ 12.000",
    rawPrice: 12000,
    description: "Lanzamiento oficial de disco extremo.",
    artists: [{ nombre: "Lacrifagia", headliner: true }],
    status: "ÚLTIMAS ENTRADAS",
    statusTone: "warning",
    capacity: 500,
    stock: 15
  },
  {
    id: "mock-3",
    title: "LAS COSAS INEXPLICABLES (FESTIVAL INDIE)",
    imageUrl: "/flyer-las-cosas-inexplicables.png",
    genres: ["INDIE", "SHOEGAZE"],
    date: "05 SEP 2026",
    rawDate: new Date("2026-09-05"),
    time: "19:00 HS",
    venue: "Niceto Club",
    price: "$ 15.000",
    rawPrice: 15000,
    description: "Festival con lo mejor de la escena indie local y Shoegaze.",
    artists: [{ nombre: "Las Cosas Inexplicables", headliner: true }],
    status: "DISPONIBLE",
    statusTone: "success",
    capacity: 1000,
    stock: 450
  },
  {
    id: "mock-4",
    title: "SABBATH NIGHT FEST",
    imageUrl: "/flyer-sabbath-fest.png",
    genres: ["ROCK", "METAL"],
    date: "18 SEP 2026",
    rawDate: new Date("2026-09-18"),
    time: "23:00 HS",
    venue: "Uniclub",
    price: "$ 10.000",
    rawPrice: 10000,
    description: "Homenaje al rock pesado clásico y doom metal.",
    artists: [{ nombre: "Heavy Sabbath", headliner: true }],
    status: "DISPONIBLE",
    statusTone: "success",
    capacity: 400,
    stock: 200
  }
];
