const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/AdminDashboard.jsx', 'utf8');

// Imports
if (!content.includes('getUsers')) {
  content = content.replace(
    'import { fetchEvents } from "../../services/eventService";',
    'import { fetchEvents } from "../../services/eventService";\nimport { getUsers, updateUserStatus, getMetrics } from "../../services/adminService";'
  );
}

// Remove mock users
const mockRegex = /const MOCK_INITIAL_USERS = \[(.|\n)*?\];/;
content = content.replace(mockRegex, '');

// State
content = content.replace(
  'const [loadingEvents, setLoadingEvents] = useState(true);',
  'const [loadingEvents, setLoadingEvents] = useState(true);\n  const [metrics, setMetrics] = useState({ ventasTotales: 0, recaudacion: 0 });'
);

// UseEffect replacement
const useEffectRegex = /useEffect\(\(\) => \{(.|\n)*?setUsers\(usersList\);\n  \}, \[\]\);/;
const newUseEffect = `useEffect(() => {
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
  }, []);`;

content = content.replace(useEffectRegex, newUseEffect);

// Action Toggle Suspend
const toggleSuspendRegex = /const handleToggleSuspend = (.|\n)*?setUsers\(updated\);\n  \};/;
const newToggleSuspend = `const handleToggleSuspend = async (id, email, currentSuspended) => {
    const nextStatus = !currentSuspended;
    try {
      await updateUserStatus(id, { isSuspended: nextStatus });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isSuspended: nextStatus } : u));
      showToastMsg(\`Usuario \${email} \${nextStatus ? "suspendido" : "activado"} con éxito\`);
    } catch (err) {
      showToastMsg("Error al cambiar estado", true);
    }
  };`;
content = content.replace(toggleSuspendRegex, newToggleSuspend);

// Action Change Role
const changeRoleRegex = /const handleChangeRole = (.|\n)*?setUsers\(updated\);\n  \};/;
const newChangeRole = `const handleChangeRole = async (id, email, newRole) => {
    try {
      await updateUserStatus(id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      showToastMsg(\`Rol de \${email} cambiado a \${newRole}\`);
    } catch (err) {
      showToastMsg("Error al cambiar rol", true);
    }
  };`;
content = content.replace(changeRoleRegex, newChangeRole);

// Action Approve Producer
const approveRegex = /const handleApproveProducer = (.|\n)*?setUsers\(updated\);\n  \};/;
const newApprove = `const handleApproveProducer = async (id, email) => {
    try {
      await updateUserStatus(id, { isVerifiedProducer: true, isPendingApproval: false });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerifiedProducer: true, isPendingApproval: false } : u));
      showToastMsg(\`Productor \${email} aprobado\`);
    } catch (err) {
      showToastMsg("Error al aprobar productor", true);
    }
  };`;
content = content.replace(approveRegex, newApprove);

// Replace args in the UI calling functions
content = content.replace(/handleToggleSuspend\(u\.id, u\.email\)/g, 'handleToggleSuspend(u.id, u.email, u.isSuspended)');

// Update TICKETS count in UI
content = content.replace(
  /<div className=\{styles\.statValue\}>0<\/div>\s*<div className=\{styles\.statLabel\}>TICKETS<\/div>/,
  '<div className={styles.statValue}>{metrics.ventasTotales}</div><div className={styles.statLabel}>TICKETS</div>'
);

fs.writeFileSync('src/pages/dashboard/AdminDashboard.jsx', content);
console.log('AdminDashboard connected to API');
