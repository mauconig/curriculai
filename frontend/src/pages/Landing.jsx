import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Download, Layout, CheckCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  // Theme state - default to light, check localStorage and system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: <FileText size={32} />,
      title: 'Editor Intuitivo',
      description: 'Crea tu currículum con formularios fáciles de usar. Auto-guardado en tiempo real.'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Mejoras con IA',
      description: 'Obtén sugerencias inteligentes para mejorar cada sección de tu currículum.'
    },
    {
      icon: <Layout size={32} />,
      title: 'Múltiples Plantillas',
      description: 'Elige entre diseños modernos, clásicos o minimalistas según tu sector.'
    },
    {
      icon: <Download size={32} />,
      title: 'Exporta a PDF',
      description: 'Descarga tu currículum en formato PDF profesional con un solo click.'
    }
  ];

  const templates = [
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Diseño limpio y colorido',
      color: '#3b82f6'
    },
    {
      id: 'classic',
      name: 'Clásico',
      description: 'Formato tradicional',
      color: '#1f2937'
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      description: 'Estilo minimalista',
      color: '#10b981'
    }
  ];

  const benefits = [
    'Solo $1 por currículum creado',
    'Sin suscripciones ni membresías',
    'Datos guardados de forma segura',
    'Accede desde cualquier dispositivo',
    'Optimizado para móvil'
  ];

  return (
    <div className="landing">
      {/* Header/Nav */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <FileText size={28} />
            <span>CurriculAI</span>
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Empezar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Crea tu Currículum Profesional
              <span className="gradient-text"> con IA</span>
            </h1>
            <p className="hero-subtitle">
              Diseña, mejora y exporta tu currículum profesional en minutos.
              Potenciado por inteligencia artificial. Sin suscripciones, solo pagas $1 por cada CV que crees.
            </p>
            <div className="hero-cta">
              <button
                className="btn-primary btn-large"
                onClick={() => navigate('/login')}
              >
                <Sparkles size={20} />
                Empezar Ahora
              </button>
              <p className="cta-note">
                Solo $1 por CV • Sin suscripciones • Listo en 2 minutos
              </p>
            </div>
          </div>
          <div className="hero-image">
            <div className="template-preview">
              <div className="template-mockup">
                <div className="mockup-header" style={{ backgroundColor: templates.find(t => t.id === selectedTemplate)?.color }}>
                  <div className="mockup-avatar"></div>
                  <div className="mockup-info">
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                  </div>
                </div>
                <div className="mockup-body">
                  <div className="mockup-section">
                    <div className="mockup-line"></div>
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                  </div>
                  <div className="mockup-section">
                    <div className="mockup-line"></div>
                    <div className="mockup-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Todo lo que necesitas para crear tu currículum perfecto</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="templates-section">
        <div className="container">
          <h2 className="section-title">Elige tu plantilla favorita</h2>
          <p className="section-subtitle">
            Diseños profesionales optimizados para cualquier sector
          </p>
          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'active' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="template-preview-small" style={{ borderColor: template.color }}>
                  <div className="preview-header" style={{ backgroundColor: template.color }}></div>
                  <div className="preview-body">
                    <div className="preview-line"></div>
                    <div className="preview-line"></div>
                  </div>
                </div>
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">Precio Simple y Transparente</h2>
          <p className="section-subtitle">
            Sin suscripciones mensuales, sin cargos ocultos
          </p>
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">1</span>
              </div>
              <p className="price-description">por currículum creado</p>
            </div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <CheckCircle size={20} className="check-icon-small" />
                <span>Acceso completo al editor</span>
              </div>
              <div className="pricing-feature">
                <CheckCircle size={20} className="check-icon-small" />
                <span>Sugerencias ilimitadas con IA</span>
              </div>
              <div className="pricing-feature">
                <CheckCircle size={20} className="check-icon-small" />
                <span>Todas las plantillas disponibles</span>
              </div>
              <div className="pricing-feature">
                <CheckCircle size={20} className="check-icon-small" />
                <span>Exportación a PDF de alta calidad</span>
              </div>
              <div className="pricing-feature">
                <CheckCircle size={20} className="check-icon-small" />
                <span>Guardado en la nube</span>
              </div>
            </div>
            <button
              className="btn-primary btn-large pricing-btn"
              onClick={() => navigate('/login')}
            >
              Crear mi Currículum
            </button>
          </div>
          <p className="pricing-note">
            💡 Crea y edita tu CV sin límite de tiempo. Solo pagas cuando estés listo para exportarlo.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">¿Por qué elegir CurriculAI?</h2>
          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <CheckCircle size={24} className="check-icon" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Comienza a crear tu currículum ahora</h2>
            <p>Únete a miles de profesionales que ya usan CurriculAI</p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Empezar Gratis
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <FileText size={24} />
              <span>CurriculAI</span>
            </div>
            <p className="footer-text">
              Creado con ❤️ para ayudarte a conseguir tu próximo trabajo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
