import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, LogOut, User, FileDown, Edit, Trash2, Clock } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import ConfirmModal from '../components/common/ConfirmModal';
import authService from '../services/authService';
import resumeService from '../services/resumeService';
import pdfService from '../services/pdfService';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, resume: null });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData.authenticated) {
        setUser(userData.user);
        await loadData();
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

  const loadData = async () => {
    try {
      const [resumesData, pdfsData] = await Promise.all([
        resumeService.getResumes(),
        pdfService.getPDFs()
      ]);
      setResumes(resumesData || []);
      setPdfs(pdfsData || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar tus currículums');
    }
  };

  // Get the latest PDF for a resume
  const getLatestPdf = (resumeId) => {
    return pdfs.find(pdf => pdf.resume_id === resumeId);
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

  const handleEditResume = (resumeId) => {
    navigate(`/editor/contacto?id=${resumeId}`);
  };

  const handleDownloadPdf = async (pdf) => {
    setDownloadingPdf(pdf.id);
    try {
      await pdfService.downloadPDF(pdf.id, pdf.filename);
      toast.success('PDF descargado');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el PDF');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleExportResume = (resumeId) => {
    navigate(`/editor/exportacion?id=${resumeId}`);
  };

  const handleDeleteResume = (resume) => {
    setDeleteModal({ open: true, resume });
  };

  const confirmDelete = async () => {
    if (!deleteModal.resume) return;

    try {
      await resumeService.deleteResume(deleteModal.resume.id);
      setResumes(prev => prev.filter(r => r.id !== deleteModal.resume.id));
      setPdfs(prev => prev.filter(p => p.resume_id !== deleteModal.resume.id));
      toast.success('Currículum eliminado');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el currículum');
    } finally {
      setDeleteModal({ open: false, resume: null });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Eliminar Currículum"
        message={`¿Estás seguro de que quieres eliminar "${deleteModal.resume?.title || 'este currículum'}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, resume: null })}
        variant="danger"
      />

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
                {resumes.map((resume) => {
                  const latestPdf = getLatestPdf(resume.id);
                  return (
                    <div key={resume.id} className="resume-card">
                      <div className="resume-card-header">
                        <FileText size={24} />
                        <h4>{resume.title}</h4>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteResume(resume)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="resume-card-info">
                        <span className="resume-date">
                          Actualizado: {new Date(resume.updated_at).toLocaleDateString('es-ES')}
                        </span>
                        <span className="resume-template">{resume.template || 'modern'}</span>
                      </div>

                      {/* PDF Info */}
                      {latestPdf && (
                        <div className="resume-pdf-info">
                          <FileDown size={14} />
                          <span>PDF guardado ({formatFileSize(latestPdf.file_size)})</span>
                        </div>
                      )}

                      <div className="resume-card-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditResume(resume.id)}
                        >
                          <Edit size={16} />
                          Editar
                        </button>

                        {latestPdf ? (
                          <button
                            className={`btn-download ${downloadingPdf === latestPdf.id ? 'loading' : ''}`}
                            onClick={() => handleDownloadPdf(latestPdf)}
                            disabled={downloadingPdf === latestPdf.id}
                          >
                            {downloadingPdf === latestPdf.id ? (
                              <>
                                <Clock size={16} className="spinning" />
                                Descargando...
                              </>
                            ) : (
                              <>
                                <FileDown size={16} />
                                Descargar PDF
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn-export"
                            onClick={() => handleExportResume(resume.id)}
                          >
                            <FileDown size={16} />
                            Exportar PDF
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
