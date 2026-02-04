import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactForm from './pages/editor/ContactForm';
import ExperienceForm from './pages/editor/ExperienceForm';
import EducationForm from './pages/editor/EducationForm';
import SkillsForm from './pages/editor/SkillsForm';
import SummaryForm from './pages/editor/SummaryForm';
import TemplateForm from './pages/editor/TemplateForm';
import PreviewForm from './pages/editor/PreviewForm';
import PaymentForm from './pages/editor/PaymentForm';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#667eea',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/contacto" element={<ContactForm />} />
        <Route path="/editor/experiencia" element={<ExperienceForm />} />
        <Route path="/editor/educacion" element={<EducationForm />} />
        <Route path="/editor/habilidades" element={<SkillsForm />} />
        <Route path="/editor/resumen" element={<SummaryForm />} />
        <Route path="/editor/plantilla" element={<TemplateForm />} />
        <Route path="/editor/preview" element={<PreviewForm />} />
        <Route path="/editor/pago" element={<PaymentForm />} />
      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
