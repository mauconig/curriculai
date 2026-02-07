import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileIcon, StarsIcon, DownloadIcon, LayoutIcon, CheckmarkCircleIcon, ArrowRightIcon, MoonIcon, SunIcon, LanguageSkillIcon } from '@hugeicons/core-free-icons';
import { useTheme } from '../contexts/ThemeContext';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: <HugeiconsIcon icon={FileIcon} size={32} />,
      title: 'Editor Intuitivo',
      description: 'Crea tu currículum con formularios fáciles de usar. Auto-guardado en tiempo real.'
    },
    {
      icon: <HugeiconsIcon icon={StarsIcon} size={32} />,
      title: 'Mejoras con IA',
      description: 'Obtén sugerencias inteligentes para mejorar cada sección de tu currículum.'
    },
    {
      icon: <HugeiconsIcon icon={LayoutIcon} size={32} />,
      title: 'Múltiples Plantillas',
      description: 'Elige entre diseños modernos, clásicos o minimalistas según tu sector.'
    },
    {
      icon: <HugeiconsIcon icon={LanguageSkillIcon} size={32} />,
      title: 'Traducción con IA',
      description: 'Traduce tu CV a 10 idiomas con un click. Edita y ajusta cada traducción.'
    },
    {
      icon: <HugeiconsIcon icon={DownloadIcon} size={32} />,
      title: 'Exporta a PDF',
      description: 'Descarga tu currículum en formato PDF profesional con un solo click.'
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
            <HugeiconsIcon icon={FileIcon} size={28} />
            <span>CurriculAI</span>
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <HugeiconsIcon icon={SunIcon} size={20} /> : <HugeiconsIcon icon={MoonIcon} size={20} />}
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
                <HugeiconsIcon icon={StarsIcon} size={20} />
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
                <div className="mockup-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
          <h2 className="section-title">20 plantillas profesionales</h2>
          <p className="section-subtitle">
            Con foto, sin foto y optimizadas para ATS. Todas con paletas de colores personalizables.
          </p>

          <div className="templates-row">
            {/* 1. Modern */}
            <div className="template-card-landing">
              <div className="template-realistic modern" style={{'--cv-primary': '#667eea', '--cv-secondary': '#764ba2', '--cv-primary-light': 'rgba(102, 126, 234, 0.1)'}}>
                <div className="realistic-header">
                  <div className="realistic-photo"><span>MG</span></div>
                  <div className="realistic-info">
                    <h4 className="realistic-name">María García López</h4>
                    <p className="realistic-title">Desarrolladora Full Stack</p>
                    <div className="realistic-contact">
                      <span>maria.garcia@email.com</span>
                      <span>+34 612 345 678</span>
                    </div>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">RESUMEN</h5>
                  <p className="realistic-text">Desarrolladora con 5+ años de experiencia en aplicaciones web escalables. Especializada en React, Node.js y arquitecturas cloud.</p>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">EXPERIENCIA</h5>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Senior Developer</strong>
                      <span className="realistic-date">Ene 2022 — Presente</span>
                    </div>
                    <p className="realistic-company">TechCorp Solutions</p>
                  </div>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Full Stack Developer</strong>
                      <span className="realistic-date">Mar 2019 — Dic 2021</span>
                    </div>
                    <p className="realistic-company">StartupXYZ</p>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">HABILIDADES</h5>
                  <div className="realistic-skills">
                    <span className="realistic-skill">React</span>
                    <span className="realistic-skill">Node.js</span>
                    <span className="realistic-skill">TypeScript</span>
                    <span className="realistic-skill">PostgreSQL</span>
                  </div>
                </div>
              </div>
              <div className="template-card-label">
                <h3>Moderno</h3>
              </div>
            </div>

            {/* 2. Creative */}
            <div className="template-card-landing">
              <div className="template-realistic creative" style={{'--cv-primary': '#8b5cf6', '--cv-secondary': '#d946ef', '--cv-primary-light': 'rgba(139, 92, 246, 0.1)'}}>
                <div className="realistic-header">
                  <div className="realistic-photo"><span>LP</span></div>
                  <div className="realistic-info">
                    <h4 className="realistic-name">Laura Pérez Ruiz</h4>
                    <p className="realistic-title">Directora de Marketing</p>
                    <div className="realistic-contact">
                      <span>laura@email.com</span>
                      <span>+34 633 111 222</span>
                    </div>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">EXPERIENCIA</h5>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Head of Marketing</strong>
                      <span className="realistic-date">2021 — Presente</span>
                    </div>
                    <p className="realistic-company">BrandAgency</p>
                  </div>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Marketing Manager</strong>
                      <span className="realistic-date">2018 — 2021</span>
                    </div>
                    <p className="realistic-company">CreativeStudio</p>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">HABILIDADES</h5>
                  <div className="realistic-skills">
                    <span className="realistic-skill">SEO</span>
                    <span className="realistic-skill">Google Ads</span>
                    <span className="realistic-skill">Analytics</span>
                    <span className="realistic-skill">Figma</span>
                  </div>
                </div>
              </div>
              <div className="template-card-label">
                <h3>Creativo</h3>
              </div>
            </div>

            {/* 3. Elegant */}
            <div className="template-card-landing">
              <div className="template-realistic elegant" style={{'--cv-primary': '#1e3a5f', '--cv-secondary': '#0f2744', '--cv-primary-light': 'rgba(30, 58, 95, 0.1)'}}>
                <div className="realistic-header">
                  <div className="realistic-photo"><span>AM</span></div>
                  <div className="realistic-info">
                    <h4 className="realistic-name">Ana Martínez Silva</h4>
                    <p className="realistic-title">Product Manager</p>
                    <div className="realistic-contact">
                      <span>ana@email.com</span>
                      <span>+34 655 444 333</span>
                    </div>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">EXPERIENCIA</h5>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>PM Lead</strong>
                      <span className="realistic-date">2022 — Presente</span>
                    </div>
                    <p className="realistic-company">Digital Agency</p>
                  </div>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Product Owner</strong>
                      <span className="realistic-date">2019 — 2022</span>
                    </div>
                    <p className="realistic-company">TechStartup</p>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">HABILIDADES</h5>
                  <div className="realistic-skills">
                    <span className="realistic-skill">Scrum</span>
                    <span className="realistic-skill">Jira</span>
                    <span className="realistic-skill">SQL</span>
                    <span className="realistic-skill">Notion</span>
                  </div>
                </div>
              </div>
              <div className="template-card-label">
                <h3>Elegante</h3>
              </div>
            </div>

            {/* 4. Bold */}
            <div className="template-card-landing">
              <div className="template-realistic bold" style={{'--cv-primary': '#dc2626', '--cv-secondary': '#991b1b', '--cv-primary-light': 'rgba(220, 38, 38, 0.1)'}}>
                <div className="realistic-header">
                  <div className="realistic-photo"><span>CR</span></div>
                  <div className="realistic-info">
                    <h4 className="realistic-name">Carlos Rodríguez</h4>
                    <p className="realistic-title">Ingeniero de Software</p>
                    <div className="realistic-contact">
                      <span>carlos@email.com</span>
                      <span>+34 698 765 432</span>
                    </div>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">EXPERIENCIA</h5>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Backend Engineer</strong>
                      <span className="realistic-date">2021 — Presente</span>
                    </div>
                    <p className="realistic-company">FinTech Corp</p>
                  </div>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Software Engineer</strong>
                      <span className="realistic-date">2018 — 2021</span>
                    </div>
                    <p className="realistic-company">DataSystems</p>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">HABILIDADES</h5>
                  <div className="realistic-skills">
                    <span className="realistic-skill">Java</span>
                    <span className="realistic-skill">Spring</span>
                    <span className="realistic-skill">PostgreSQL</span>
                    <span className="realistic-skill">Kafka</span>
                  </div>
                </div>
              </div>
              <div className="template-card-label">
                <h3>Audaz</h3>
              </div>
            </div>

            {/* 5. ATS Standard */}
            <div className="template-card-landing">
              <div className="template-realistic ats">
                <div className="realistic-header">
                  <div className="realistic-info">
                    <h4 className="realistic-name">Diego López Fernández</h4>
                    <p className="realistic-title">Analista de Datos</p>
                    <div className="realistic-contact">
                      <span>diego@email.com</span>
                      <span>+34 677 888 999</span>
                    </div>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">EXPERIENCIA</h5>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Data Analyst</strong>
                      <span className="realistic-date">2022 — Presente</span>
                    </div>
                    <p className="realistic-company">BigData Corp</p>
                  </div>
                  <div className="realistic-item">
                    <div className="realistic-item-header">
                      <strong>Junior Data Analyst</strong>
                      <span className="realistic-date">2020 — 2022</span>
                    </div>
                    <p className="realistic-company">ConsultingGroup</p>
                  </div>
                </div>
                <div className="realistic-section">
                  <h5 className="realistic-section-title">HABILIDADES</h5>
                  <div className="realistic-skills">
                    <span className="realistic-skill">Python</span>
                    <span className="realistic-skill">SQL</span>
                    <span className="realistic-skill">Tableau</span>
                    <span className="realistic-skill">Excel</span>
                  </div>
                </div>
              </div>
              <div className="template-card-label">
                <h3>ATS Estándar</h3>
              </div>
            </div>
          </div>

          <p className="templates-more">+ 15 plantillas más disponibles: Clásico, Ejecutivo, Compacto, Corporativo, Minimalista, Académico y más</p>
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
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
                <span>Acceso completo al editor</span>
              </div>
              <div className="pricing-feature">
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
                <span>Sugerencias ilimitadas con IA</span>
              </div>
              <div className="pricing-feature">
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
                <span>Todas las plantillas disponibles</span>
              </div>
              <div className="pricing-feature">
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
                <span>Traducción IA a 10 idiomas</span>
              </div>
              <div className="pricing-feature">
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
                <span>Exportación a PDF de alta calidad</span>
              </div>
              <div className="pricing-feature">
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={20} className="check-icon-small" />
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
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={24} className="check-icon" />
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
              <HugeiconsIcon icon={ArrowRightIcon} size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <HugeiconsIcon icon={FileIcon} size={24} />
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
