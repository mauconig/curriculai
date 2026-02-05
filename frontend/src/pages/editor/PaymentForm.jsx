import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CreditCard, Shield, Lock, Check, Clock, FileText
} from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import './PaymentForm.css';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Tarjeta de Credito/Debito', icon: CreditCard },
  { id: 'paypal', name: 'PayPal', icon: Shield }
];

const PaymentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    previousStep,
    nextStep
  } = useResumeWizard(8, resumeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleBack = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/dashboard');
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (field === 'name') {
      formattedValue = value.toUpperCase();
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Get CV title from data
  const getCVTitle = () => {
    const { personalInfo } = resumeData;
    if (personalInfo?.firstName && personalInfo?.lastName) {
      return `CV de ${personalInfo.firstName} ${personalInfo.lastName}`;
    }
    return 'Mi Curriculum';
  };

  // Get template name
  const getTemplateName = () => {
    const templates = {
      'modern': 'Moderno',
      'classic': 'Clasico',
      'creative': 'Creativo',
      'executive': 'Ejecutivo',
      'minimal': 'Minimalista',
      'modern-text': 'Moderno Texto',
      'classic-text': 'Clasico Texto',
      'ats-standard': 'ATS Estandar',
      'ats-professional': 'ATS Profesional',
      'ats-simple': 'ATS Simple'
    };
    return templates[resumeData.template] || 'Moderno';
  };

  return (
    <div className="payment-form-page">
      <ConfirmModal
        isOpen={showCancelModal}
        title="¿Cancelar creacion del curriculum?"
        message="Si vuelves al dashboard, perderas todos los cambios que no se hayan guardado."
        confirmText="Si, cancelar"
        cancelText="Continuar editando"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
        variant="warning"
      />

      <WizardProgress currentStep={currentStep} />

      <div className="payment-form-container">
        <div className="payment-form-header">
          <div>
            <h1>Finalizar Compra</h1>
            <p>Completa el pago para exportar tu curriculum sin marca de agua</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="checkout-content">
          {/* Payment Form Section */}
          <div className="checkout-form-section">
            <div className="checkout-card">
              <h2>Metodo de Pago</h2>

              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`payment-method-option ${selectedPayment === method.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                      <Icon size={20} />
                      <span>{method.name}</span>
                    </label>
                  );
                })}
              </div>

              {/* Card Form with Coming Soon Overlay */}
              <div className="card-form-wrapper">
                <div className="coming-soon-overlay">
                  <div className="coming-soon-content">
                    <Clock size={32} />
                    <h3>Proximamente</h3>
                    <p>El sistema de pagos estara disponible pronto.</p>
                  </div>
                </div>

                {selectedPayment === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>
                        <CreditCard size={16} />
                        Numero de Tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        disabled
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de Expiracion</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleCardChange('expiry', e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <Lock size={16} />
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={3}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleCardChange('name', e.target.value)}
                        placeholder="JUAN PEREZ"
                        disabled
                      />
                    </div>

                    <button className="pay-button" disabled>
                      <Lock size={18} />
                      Pagar $1.00 USD
                    </button>
                  </div>
                )}

                {selectedPayment === 'paypal' && (
                  <div className="paypal-form">
                    <p>Seras redirigido a PayPal para completar tu pago de forma segura.</p>
                    <button className="paypal-button" disabled>
                      <Shield size={20} />
                      Continuar con PayPal
                    </button>
                  </div>
                )}
              </div>

              <div className="security-note">
                <Shield size={16} />
                <span>Tus datos estan protegidos con encriptacion SSL de 256 bits</span>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="checkout-summary-section">
            <div className="checkout-card summary-card">
              <h2>Resumen del Pedido</h2>

              <div className="cv-preview-mini">
                <div className="cv-thumbnail-mockup">
                  <FileText size={32} />
                </div>
                <div className="cv-info">
                  <h3>{getCVTitle()}</h3>
                  <p>Plantilla: {getTemplateName()}</p>
                </div>
              </div>

              <div className="order-details">
                <div className="order-line">
                  <span>Exportar CV en PDF</span>
                  <span>$1.00</span>
                </div>
                <div className="order-line">
                  <span>Impuestos</span>
                  <span>$0.00</span>
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span>$1.00 USD</span>
                </div>
              </div>

              <div className="benefits-list">
                <div className="benefit-item">
                  <Check size={16} />
                  <span>PDF sin marca de agua</span>
                </div>
                <div className="benefit-item">
                  <Check size={16} />
                  <span>Descarga inmediata</span>
                </div>
                <div className="benefit-item">
                  <Check size={16} />
                  <span>Formato profesional</span>
                </div>
                <div className="benefit-item">
                  <Check size={16} />
                  <span>Listo para enviar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            <span>Volver al Dashboard</span>
          </button>

          <div className="form-navigation-right">
            <button
              type="button"
              className="btn-prev"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn-next"
              onClick={nextStep}
            >
              <span>Siguiente</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
