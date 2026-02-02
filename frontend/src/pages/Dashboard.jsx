import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, LogOut, User, FileDown } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import authService from '../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData.authenticated) {
        setUser(userData.user);
        // TODO: Cargar currículums del usuario
        setResumes([]);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleCreateResume = () => {
    navigate('/editor/contacto');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <FileText size={32} />
            <h1>CurriculAI</h1>
          </div>

          <div className="header-user">
            <div className="user-info">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <span className="user-name">{user?.name}</span>
            </div>
            <ThemeToggle />
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Bienvenido, {user?.name?.split(' ')[0]}!</h2>
            <p>Gestiona tus currículums profesionales con inteligencia artificial</p>
          </section>

          {/* Action Button */}
          <div className="action-section">
            <button className="create-resume-btn" onClick={handleCreateResume}>
              <Plus size={28} strokeWidth={2} />
              <span>Crear Nuevo Currículum</span>
            </button>
          </div>

          {/* Resumes List */}
          <section className="resumes-section">
            <h3>Mis Currículums</h3>

            {resumes.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} strokeWidth={1.5} />
                <h4>Aún no tienes currículums</h4>
                <p>Crea tu primer currículum profesional con ayuda de IA</p>
                <button className="create-resume-btn" onClick={handleCreateResume}>
                  <Plus size={28} strokeWidth={2} />
                  <span>Crear Mi Primer Currículum</span>
                </button>
              </div>
            ) : (
              <div className="resumes-grid">
                {resumes.map((resume) => (
                  <div key={resume.id} className="resume-card">
                    <div className="resume-card-header">
                      <FileText size={24} />
                      <h4>{resume.title}</h4>
                    </div>
                    <div className="resume-card-info">
                      <span className="resume-date">
                        Actualizado: {new Date(resume.updated_at).toLocaleDateString('es-ES')}
                      </span>
                      <span className="resume-template">{resume.template}</span>
                    </div>
                    <div className="resume-card-actions">
                      <button className="btn-edit" onClick={() => alert('Editar - próximamente')}>
                        Editar
                      </button>
                      <button className="btn-export" onClick={() => alert('Exportar - próximamente')}>
                        <FileDown size={18} />
                        Exportar PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
