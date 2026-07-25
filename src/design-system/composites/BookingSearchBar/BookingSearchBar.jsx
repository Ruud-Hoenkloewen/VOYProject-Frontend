import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon, MapPinIcon, CalendarIcon, BanknoteIcon } from "../../../components/icons";
import styles from "./BookingSearchBar.module.css";

const GENRES = ["TODOS", "INDIE", "ROCK", "PUNK", "METAL", "POP", "ELECTRONICA"];

export default function BookingSearchBar({ 
  availableLugares = [], 
  availableFechas = [],
  activeLugar,
  setActiveLugar,
  activeFecha,
  setActiveFecha,
  activeCategories,
  toggleCategory
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

  return (
    <div className={styles.root}>
      {/* BUSCADOR LIBRE */}
      <div className={`${styles.field} ${styles.fieldSearch}`}>
        <span className={styles.icon}><SearchIcon /></span>
        <input 
          type="text" 
          placeholder="Artista, lugar..." 
          className={styles.input}
          value={query}
          onChange={handleSearch}
        />
      </div>
      
      <div className={styles.divider} />

      {/* LUGAR */}
      <div className={styles.field}>
        <span className={styles.icon}><MapPinIcon /></span>
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

      <div className={styles.divider} />

      {/* FECHA */}
      <div className={styles.field}>
        <span className={styles.icon}><CalendarIcon /></span>
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

      <div className={styles.divider} />

      {/* GENERO */}
      <div className={styles.field}>
        <select 
          className={styles.select}
          value={activeGenre}
          onChange={(e) => {
            // Reset categories then toggle the new one
            if (e.target.value === "TODOS") {
               toggleCategory("TODOS");
            } else {
               // A bit hacky, but useEventFilters supports "TODOS" reset
               toggleCategory("TODOS"); 
               setTimeout(() => toggleCategory(e.target.value), 0);
            }
          }}
        >
          {GENRES.map(g => (
            <option key={g} value={g}>{g === "TODOS" ? "Cualquier género" : g}</option>
          ))}
        </select>
      </div>

      <div className={styles.divider} />

      {/* PRECIO */}
      <div className={styles.field}>
        <span className={styles.icon}><BanknoteIcon /></span>
        <select 
          className={styles.select}
          value={maxPrice}
          onChange={handlePriceChange}
        >
          <option value="">Sin límite</option>
          <option value="5000">Hasta $5.000</option>
          <option value="10000">Hasta $10.000</option>
          <option value="15000">Hasta $15.000</option>
        </select>
      </div>

      {/* BUTTON (Optional: Search icon if we want to submit) */}
      <button className={styles.searchBtn} aria-label="Buscar">
        Buscar
      </button>

    </div>
  );
}
