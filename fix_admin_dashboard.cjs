const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/AdminDashboard.jsx', 'utf8');

const s1 = 'import { fetchEvents } from "../../services/eventService";';
const r1 = 'import { fetchEvents } from "../../services/eventService";\nimport { getUsers, updateUserStatus, getMetrics } from "../../services/adminService";';
if (!content.includes('getUsers')) content = content.replace(s1, r1);

const startIdx = content.indexOf('const MOCK_INITIAL_USERS');
const endIdx = content.indexOf('export default function AdminDashboard');
if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
}

content = content.replace('const [loadingEvents, setLoadingEvents] = useState(true);', 'const [loadingEvents, setLoadingEvents] = useState(true);\n  const [metrics, setMetrics] = useState({ ventasTotales: 0, recaudacion: 0 });');

const effStart = content.indexOf('// Load events and initialize users list');
const effEnd = content.indexOf('// Action: Toggle Suspend');
if (effStart !== -1 && effEnd !== -1) {
  const newEff = `// Load events, users, and metrics from real API
  useEffect(() => {
    Promise.all([fetchEvents(), getUsers(), getMetrics()])
      .then(([eventsData, usersData, metricsData]) => {
        setEvents(eventsData);
        setUsers(usersData);
        setMetrics(metricsData || { ventasTotales: 0, recaudacion: 0 });
      })
      .catch(err => {
        console.error(err);
        showToastMsg("Error al obtener datos del servidor", true);
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, []);

  `;
  content = content.substring(0, effStart) + newEff + content.substring(effEnd);
}

const actStart = content.indexOf('// Action: Toggle Suspend');
const actEnd = content.indexOf('// Helper to check if a user is featured');
if (actStart !== -1 && actEnd !== -1) {
  const newActions = `// Action: Toggle Suspend
  const handleToggleSuspend = async (id, email, currentSuspended) => {
    const nextStatus = !currentSuspended;
    try {
      await updateUserStatus(id, { isSuspended: nextStatus });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isSuspended: nextStatus } : u));
      showToastMsg(\`Usuario \${email} \${nextStatus ? "suspendido" : "activado"} con éxito\`);
    } catch (err) {
      showToastMsg("Error al cambiar estado", true);
    }
  };

  // Action: Change Role
  const handleChangeRole = async (id, email, newRole) => {
    try {
      await updateUserStatus(id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      showToastMsg(\`Rol de \${email} cambiado a \${newRole}\`);
    } catch (err) {
      showToastMsg("Error al cambiar rol", true);
    }
  };

  // Action: Approve Producer
  const handleApproveProducer = async (id, email) => {
    try {
      await updateUserStatus(id, { isVerifiedProducer: true, isPendingApproval: false });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerifiedProducer: true, isPendingApproval: false } : u));
      showToastMsg(\`Productor \${email} aprobado\`);
    } catch (err) {
      showToastMsg("Error al aprobar productor", true);
    }
  };

  `;
  content = content.substring(0, actStart) + newActions + content.substring(actEnd);
}

content = content.replace(/handleToggleSuspend\(u\.id, u\.email\)/g, 'handleToggleSuspend(u.id, u.email, u.isSuspended)');

content = content.replace(
  '<div className={styles.statValue}>0</div>\n            <div className={styles.statLabel}>TICKETS</div>',
  '<div className={styles.statValue}>{metrics.ventasTotales}</div>\n            <div className={styles.statLabel}>TICKETS</div>'
);

fs.writeFileSync('src/pages/dashboard/AdminDashboard.jsx', content);
console.log('Fixed completely!');
