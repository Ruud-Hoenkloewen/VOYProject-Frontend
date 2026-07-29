/**
 * Definiendo tipos e interfaces para la entidad Artista y sus relaciones.
 */

export interface FollowerRelation {
  followerId: string;
  targetId: string;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  artistId: string;
  title: string;
  album?: string;
  duration: string; // ej: "3:45"
  audioUrl?: string; // URL de preview MP3 / audio
  spotifyUrl?: string;
  coverUrl?: string;
  playsCount: number;
  releaseDate?: string;
}

export interface ArtistEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  image?: string;
  roleInEvent?: string; // ej: "Banda Principal", "Telonero", "Invitado"
}

export interface ArtistInteraction {
  id: string;
  artistId: string;
  authorName: string;
  authorAvatar?: string;
  authorHandle?: string;
  authorRole?: string;
  type: 'announcement' | 'post' | 'comment' | 'release';
  content: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
}

export interface ArtistUser {
  _id: string;
  id?: string;
  nombre: string;
  nombreArtistico?: string;
  username: string;
  email?: string;
  role: 'artist' | 'producer' | 'client' | 'admin';
  rol?: string;
  tags: string[]; // ej: ["artista", "punk", "tucuman"]
  bio: string;
  avatarUrl?: string;
  fotoPerfil?: string;
  avatarColor?: string;
  bannerGradiente?: string;
  bannerUrl?: string;
  ubicacion: string;
  generosMusicales: string[];
  vibeEnShows?: string[];
  seguidores: string[]; // array de IDs de seguidores
  siguiendo: string[]; // array de IDs que sigue
  seguidoresCount: number;
  siguiendoCount: number;
  isFollowing?: boolean;
  redesSociales?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
    web?: string;
    soundcloud?: string;
  };
  tracks?: MusicTrack[];
  events?: ArtistEvent[];
  interactions?: ArtistInteraction[];
}

export interface CommunityArtistFilter {
  query?: string;
  genre?: string;
  sortBy?: 'popular' | 'recent' | 'name';
}
