import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileIcon, AddIcon, LogoutIcon, UserIcon, DownloadIcon, EditIcon, DeleteIcon } from '@hugeicons/core-free-icons';
import ThemeToggle from '../components/common/ThemeToggle';
import ConfirmModal from '../components/common/ConfirmModal';
import ExportModal from '../components/dashboard/ExportModal';
import authService from '../services/authService';
import resumeService from '../services/resumeService';
import pdfService from '../services/pdfService';
import toast from 'react-hot-toast';
import { getPaletteStyle } from '../utils/colorPalettes';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, resume: null });
  const [exportModal, setExportModal] = useState({ open: false, resume: null });

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

  const handleOpenExportModal = (resume) => {
    setExportModal({ open: true, resume });
  };

  const handleResumeUpdated = (updatedResume) => {
    setResumes(prev => prev.map(r => r.id === updatedResume.id ? updatedResume : r));
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

      <ExportModal
        isOpen={exportModal.open}
        onClose={() => setExportModal({ open: false, resume: null })}
        resume={exportModal.resume}
        latestPdf={exportModal.resume ? getLatestPdf(exportModal.resume.id) : null}
        onResumeUpdated={handleResumeUpdated}
      />

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <HugeiconsIcon icon={FileIcon} size={32} />
            <h1>CurriculAI</h1>
          </div>

          <div className="header-user">
            <div className="user-info">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <HugeiconsIcon icon={UserIcon} size={20} />
                </div>
              )}
              <span className="user-name">{user?.name}</span>
            </div>
            <ThemeToggle />
            <button className="logout-btn" onClick={handleLogout}>
              <HugeiconsIcon icon={LogoutIcon} size={18} />
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
              <HugeiconsIcon icon={AddIcon} size={28} strokeWidth={2} />
              <span>Crear Nuevo Currículum</span>
            </button>
          </div>

          {/* Resumes List */}
          <section className="resumes-section">
            <h3>Mis Currículums</h3>

            {resumes.length === 0 ? (
              <div className="empty-state">
                <HugeiconsIcon icon={FileIcon} size={64} strokeWidth={1.5} />
                <h4>Aún no tienes currículums</h4>
                <p>Crea tu primer currículum profesional con ayuda de IA</p>
                <button className="create-resume-btn" onClick={handleCreateResume}>
                  <HugeiconsIcon icon={AddIcon} size={28} strokeWidth={2} />
                  <span>Crear Mi Primer Currículum</span>
                </button>
              </div>
            ) : (
              <div className="resumes-grid">
                {resumes.map((resume) => {
                  const latestPdf = getLatestPdf(resume.id);
                  const data = resume.data || {};
                  const personalInfo = data.personalInfo || {};
                  const template = resume.template || 'modern';
                  const hasPhoto = ['modern', 'classic', 'creative', 'executive', 'elegant', 'bold', 'compact', 'corporate'].includes(template);

                  // Get initials
                  const getInitials = () => {
                    const first = personalInfo.firstName?.[0] || '';
                    const last = personalInfo.lastName?.[0] || '';
                    return (first + last).toUpperCase() || 'CV';
                  };

                  return (
                    <div key={resume.id} className="resume-card" onClick={() => handleEditResume(resume.id)}>
                      {/* Mini CV Preview */}
                      <div className={`mini-cv-preview template-${template}`} style={getPaletteStyle(data.colorPalette, template)}>
                        <button
                          className="btn-delete-floating"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume);
                          }}
                          title="Eliminar"
                        >
                          <HugeiconsIcon icon={DeleteIcon} size={14} />
                        </button>

                        <div className="mini-cv-paper">
                          {/* Mini Header */}
                          <div className="mini-cv-header">
                            {hasPhoto && (
                              <div className="mini-cv-photo">
                                {personalInfo.photo ? (
                                  <img src={personalInfo.photo} alt="" />
                                ) : (
                                  <span>{getInitials()}</span>
                                )}
                              </div>
                            )}
                            <div className="mini-cv-info">
                              <div className="mini-cv-name">
                                {personalInfo.firstName || personalInfo.lastName
                                  ? `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim()
                                  : 'Tu Nombre'}
                              </div>
                              <div className="mini-cv-contact">
                                {personalInfo.email || 'email@ejemplo.com'}
                              </div>
                            </div>
                          </div>

                          {/* Mini Sections */}
                          <div className="mini-cv-sections">
                            {data.summary && (
                              <div className="mini-cv-section">
                                <div className="mini-section-title"></div>
                                <div className="mini-section-line"></div>
                                <div className="mini-section-line short"></div>
                              </div>
                            )}
                            {data.experience?.length > 0 && (
                              <div className="mini-cv-section">
                                <div className="mini-section-title"></div>
                                <div className="mini-section-line"></div>
                                <div className="mini-section-line"></div>
                                <div className="mini-section-line short"></div>
                              </div>
                            )}
                            {data.education?.length > 0 && (
                              <div className="mini-cv-section">
                                <div className="mini-section-title"></div>
                                <div className="mini-section-line"></div>
                                <div className="mini-section-line short"></div>
                              </div>
                            )}
                            {data.skills?.length > 0 && (
                              <div className="mini-cv-section">
                                <div className="mini-section-title"></div>
                                <div className="mini-cv-skills">
                                  <span></span><span></span><span></span><span></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="resume-card-footer">
                        <div className="resume-card-meta">
                          <span className="resume-date">
                            {new Date(resume.updated_at).toLocaleDateString('es-ES')}
                          </span>
                          <span className="resume-template-badge">{template}</span>
                        </div>

                        {latestPdf && (
                          <div className="resume-pdf-info">
                            <HugeiconsIcon icon={DownloadIcon} size={12} />
                            <span>PDF ({formatFileSize(latestPdf.file_size)})</span>
                          </div>
                        )}

                        <div className="resume-card-actions">
                          <button
                            className="btn-edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditResume(resume.id);
                            }}
                          >
                            <HugeiconsIcon icon={EditIcon} size={14} />
                            Editar
                          </button>

                          <button
                            className={latestPdf ? 'btn-download' : 'btn-export'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenExportModal(resume);
                            }}
                          >
                            <HugeiconsIcon icon={DownloadIcon} size={14} />
                          </button>
                        </div>
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
