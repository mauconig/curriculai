import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Upload, X, User } from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ImageCropModal from '../../components/editor/ImageCropModal';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { FORM_LABELS, FORM_PLACEHOLDERS, BUTTON_LABELS, HELP_TEXTS } from '../../utils/constants';
import toast from 'react-hot-toast';
import './ContactForm.css';

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    saving,
    updateResumeData,
    nextStep,
    currentResumeId,
    createResume
  } = useResumeWizard(1, resumeId);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [errors, setErrors] = useState({});

  // Cargar datos existentes
  useEffect(() => {
    if (resumeData.personalInfo) {
      setFormData(resumeData.personalInfo);
      if (resumeData.personalInfo.photo) {
        setPhotoPreview(resumeData.personalInfo.photo);
      }
    }
  }, [resumeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    updateResumeData('personalInfo', { ...formData, [name]: value });

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);

      // Convertir a base64 para preview
      const base64 = await convertToBase64(file);

      // Mostrar modal de recorte
      setImageToCrop(base64);
      setShowCropModal(true);
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast.error('Error al procesar la imagen');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setPhotoPreview(croppedImage);
    const updatedData = { ...formData, photo: croppedImage };
    setFormData(updatedData);
    updateResumeData('personalInfo', updatedData);
    setShowCropModal(false);
    setImageToCrop(null);
    toast.success('Foto recortada correctamente');
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    const updatedData = { ...formData, photo: null };
    setFormData(updatedData);
    updateResumeData('personalInfo', updatedData);
    toast.success('Foto eliminada');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Si no hay resumeId, crear el currículum primero
    if (!currentResumeId) {
      try {
        await createResume('Mi Currículum');
        toast.success('Currículum creado');
      } catch (error) {
        toast.error('Error al crear el currículum');
        return;
      }
    }

    nextStep();
  };


  return (
    <div className="contact-form-page">
      {showCropModal && imageToCrop && (
        <ImageCropModal
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <WizardProgress currentStep={currentStep} />

      <div className="contact-form-container">
        <div className="contact-form-header">
          <h1>Información de Contacto</h1>
          <p>Comencemos con tu información básica de contacto</p>
        </div>

        <form className="contact-form">
          {/* Foto de perfil */}
          <div className="form-section photo-section">
            <label>{FORM_LABELS.photo}</label>
            <p className="help-text">{HELP_TEXTS.photo}</p>

            <div className="photo-upload-container">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                    title={BUTTON_LABELS.removePhoto}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="photo-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploadingPhoto}
                    style={{ display: 'none' }}
                  />
                  <div className="photo-upload-placeholder">
                    {uploadingPhoto ? (
                      <span>Subiendo...</span>
                    ) : (
                      <>
                        <User size={32} />
                        <Upload size={16} className="upload-icon" />
                        <span>{BUTTON_LABELS.uploadPhoto}</span>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{FORM_LABELS.firstName} *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={FORM_PLACEHOLDERS.firstName}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{FORM_LABELS.lastName} *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={FORM_PLACEHOLDERS.lastName}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">{FORM_LABELS.email} *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={FORM_PLACEHOLDERS.email}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label htmlFor="phone">{FORM_LABELS.phone} *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={FORM_PLACEHOLDERS.phone}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Ubicación */}
          <div className="form-group">
            <label htmlFor="location">{FORM_LABELS.location} *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder={FORM_PLACEHOLDERS.location}
              className={errors.location ? 'error' : ''}
            />
            <p className="help-text">{HELP_TEXTS.location}</p>
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

        </form>

        {/* Navigation */}
        <div className="form-navigation">
          <div className="auto-save-indicator">
            {saving && <span className="saving-text">Guardando...</span>}
          </div>

          <button
            type="button"
            className="btn-next"
            onClick={handleNext}
          >
            {BUTTON_LABELS.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
