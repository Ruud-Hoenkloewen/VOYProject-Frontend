const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/AdminDashboard.jsx', 'utf8');

const badHeaderRegex = /import \{ useState, useEffect \} from "react";[\s\S]*?return JSON\.parse\(saved\);/m;

const correctHeader = `import { useState, useEffect } from "react";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";
import { fetchEvents } from "../../services/eventService";
import { getUsers, updateUserStatus, getMetrics } from "../../services/adminService";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [metrics, setMetrics] = useState({ ventasTotales: 0, recaudacion: 0 });
  const [toast, setToast] = useState(null); // { message: string, error: boolean }
  const [featuredEventIds, setFeaturedEventIds] = useState(() => {
    const saved = localStorage.getItem("voy_featured_events");
    if (saved) {
      try {
        return JSON.parse(saved);`;

content = content.replace(badHeaderRegex, correctHeader);

fs.writeFileSync('src/pages/dashboard/AdminDashboard.jsx', content);
console.log("Fixed AdminDashboard header!");
