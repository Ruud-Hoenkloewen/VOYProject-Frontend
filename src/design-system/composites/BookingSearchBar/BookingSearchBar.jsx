import { useSearchParams } from "react-router-dom";
import { SearchIcon, MapPinIcon, CalendarIcon, BanknoteIcon, ZapIcon } from "../../../components/icons";
import styles from "./BookingSearchBar.module.css";

const ALL_GENRES = [
  "TODOS", "INDIE", "ROCK", "PUNK", "METAL", "HARDCORE", "GRUNGE", 
  "ELECTRONICA", "TECHNO", "HOUSE", "POST-PUNK", "FOLK", "JAZZ", "HIP-HOP"
];

export default function BookingSearchBar({ 
  availableLugares = [], 
  availableFechas = [],
  activeLugar,
  setActiveLugar,
  activeFecha,
  setActiveFecha,
  activeCategories = ["TODOS"],
  toggleCategory,
  sortBy = "fecha",
  setSortBy,
  resetFilters,
  resultsCount,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("q", value);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("maxPrice", value);
    } else {
      searchParams.delete("maxPrice");
    }
    setSearchParams(searchParams, { replace: true });
  };

  const activeGenre = activeCategories[0] || "TODOS";
  const isFiltered = activeLugar !== "TODOS" || activeFecha !== "TODOS" || activeGenre !== "TODOS" || Boolean(maxPrice) || sortBy !== "fecha";

  return (
    <div className={styles.wrapper}>
      {/* ── BARRAS Y CONTROLES PRINCIPALES ── */}
      <div className={styles.root}>
        {/* LUGAR */}
        <div className={styles.field}>
          <span className={styles.microLabel}>📍 LUGAR</span>
          <div className={styles.inputGroup}>
            <select 
              className={styles.select}
              value={activeLugar}
              onChange={(e) => setActiveLugar(e.target.value)}
            >
              <option value="TODOS">Cualquier lugar</option>
              {availableLugares.map(lugar => (
                <option key={lugar} value={lugar}>{lugar}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        {/* FECHA */}
        <div className={styles.field}>
          <span className={styles.microLabel}>📅 FECHA</span>
          <div className={styles.inputGroup}>
            <select 
              className={styles.select}
              value={activeFecha}
              onChange={(e) => setActiveFecha(e.target.value)}
            >
              <option value="TODOS">Cualquier fecha</option>
              {availableFechas.map(fecha => (
                <option key={fecha} value={fecha}>{fecha}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        {/* GÉNERO */}
        <div className={styles.field}>
          <span className={styles.microLabel}>🎧 GÉNERO</span>
          <div className={styles.inputGroup}>
            <select 
              className={styles.select}
              value={activeGenre}
              onChange={(e) => {
                toggleCategory("TODOS"); 
                if (e.target.value !== "TODOS") {
                  setTimeout(() => toggleCategory(e.target.value), 0);
                }
              }}
            >
              {ALL_GENRES.map(g => (
                <option key={g} value={g}>{g === "TODOS" ? "Cualquier género" : g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        {/* PRECIO */}
        <div className={styles.field}>
          <span className={styles.microLabel}>💵 PRECIO MAX</span>
          <div className={styles.inputGroup}>
            <select 
              className={styles.select}
              value={maxPrice}
              onChange={handlePriceChange}
            >
              <option value="">Sin límite</option>
              <option value="0">Gratis (Entrada Libre)</option>
              <option value="5000">Hasta $5.000</option>
              <option value="10000">Hasta $10.000</option>
              <option value="20000">Hasta $20.000</option>
              <option value="30000">Hasta $30.000</option>
            </select>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ORDENAR POR */}
        {setSortBy && (
          <div className={styles.field}>
            <span className={styles.microLabel}>⚡ ORDENAR POR</span>
            <div className={styles.inputGroup}>
              <select 
                className={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="fecha">Próximos eventos</option>
                <option value="alfabetico">Alfabéticamente (A-Z)</option>
                <option value="precio_asc">Menor precio primero</option>
                <option value="precio_desc">Mayor precio primero</option>
                <option value="popular">Más concurridos</option>
              </select>
            </div>
          </div>
        )}

        {/* RESET BUTTON IF FILTERED */}
        {isFiltered && resetFilters && (
          <button 
            type="button"
            className={styles.resetBtn}
            onClick={resetFilters}
            title="Limpiar todos los filtros"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* ── BUSCADOR DIRECTO Y CONTADOR DINÁMICO DE RESULTADOS ── */}
      <div className={styles.standaloneSearchRow}>
        <div className={styles.standaloneSearchGroup}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input 
            type="text" 
            placeholder="Buscar evento o artista..." 
            className={styles.standaloneSearchInput}
            value={query}
            onChange={handleSearch}
          />
          {query && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => {
                searchParams.delete("q");
                setSearchParams(searchParams, { replace: true });
              }}
              title="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {resultsCount !== undefined && resultsCount !== null && (
          <div className={styles.resultsCounterBadge}>
            mostrando {resultsCount} {resultsCount === 1 ? 'show' : 'shows'}
          </div>
        )}
      </div>
    </div>
  );
}
