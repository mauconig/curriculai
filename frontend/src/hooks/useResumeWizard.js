import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import resumeService from '../services/resumeService';
import { WIZARD_STEPS } from '../utils/constants';

/**
 * Hook para gestionar el estado y navegación del wizard de currículum
 */
export const useResumeWizard = (initialStep = 1, resumeId = null) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      photo: null
    },
    experience: [],
    education: [],
    skills: [],
    summary: ''
  });
  // Si hay resumeId, empezamos en loading=true hasta que se carguen los datos
  const [loading, setLoading] = useState(!!resumeId);
  const [saving, setSaving] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(resumeId);
  // Flag para saber si los datos ya fueron cargados (evita auto-guardar antes de cargar)
  const [dataLoaded, setDataLoaded] = useState(!resumeId);

  // Cargar CV existente si hay resumeId
  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
    }
  }, [resumeId]);

  const loadResume = async (id) => {
    try {
      setLoading(true);
      setDataLoaded(false);
      const resume = await resumeService.getResume(id);
      if (resume && resume.data) {
        // resume.data ya viene parseado desde el backend
        const data = typeof resume.data === 'string' ? JSON.parse(resume.data) : resume.data;
        setResumeData(data);
      }
      setCurrentResumeId(id);
    } catch (error) {
      console.error('Error al cargar currículum:', error);
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  // Auto-guardar con debounce (solo después de que los datos se hayan cargado)
  useEffect(() => {
    if (!currentResumeId || !dataLoaded) return;

    const timer = setTimeout(() => {
      saveProgress();
    }, 1000); // Auto-guardar cada 1 segundo

    return () => clearTimeout(timer);
  }, [resumeData, currentResumeId, dataLoaded]);

  const saveProgress = async () => {
    if (!currentResumeId) return;

    try {
      setSaving(true);
      await resumeService.updateResume(currentResumeId, {
        data: JSON.stringify(resumeData)
      });
    } catch (error) {
      console.error('Error al auto-guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateResumeData = useCallback((section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      const stepPath = WIZARD_STEPS.find(s => s.id === newStep)?.path;
      if (stepPath && currentResumeId) {
        navigate(`${stepPath}?id=${currentResumeId}`);
      }
    }
  }, [currentStep, currentResumeId, navigate]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      const stepPath = WIZARD_STEPS.find(s => s.id === newStep)?.path;
      if (stepPath && currentResumeId) {
        navigate(`${stepPath}?id=${currentResumeId}`);
      }
    }
  }, [currentStep, currentResumeId, navigate]);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
      const stepPath = WIZARD_STEPS.find(s => s.id === step)?.path;
      if (stepPath && currentResumeId) {
        navigate(`${stepPath}?id=${currentResumeId}`);
      }
    }
  }, [currentResumeId, navigate]);

  const createResume = async (title = 'Mi Currículum') => {
    try {
      setLoading(true);
      const newResume = await resumeService.createResume({
        title,
        data: JSON.stringify(resumeData),
        template: 'modern'
      });
      setCurrentResumeId(newResume.id);
      return newResume;
    } catch (error) {
      console.error('Error al crear currículum:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === WIZARD_STEPS.length;

  return {
    currentStep,
    resumeData,
    loading,
    saving,
    dataLoaded,
    currentResumeId,
    updateResumeData,
    nextStep,
    previousStep,
    goToStep,
    createResume,
    isFirstStep,
    isLastStep
  };
};
