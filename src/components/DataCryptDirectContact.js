/**
 * 📞 DATACRYPT DIRECT CONTACT SYSTEM
 * Sistema de Contacto Directo - Reemplazo del Chatbot
 * Sin intermediarios, comunicación directa profesional
 */

class DataCryptDirectContact {
    constructor() {
        this.contactInfo = {
            ceo: {
                name: 'Ferney Quiroga',
                email: 'ferneyquiroga101@gmail.com',
                title: 'CEO & Data Scientist',
                specialties: ['Business Intelligence', 'Machine Learning', 'Big Data Analytics']
            },
            company: {
                name: 'DataCrypt_Labs',
                focus: 'Soluciones de Datos Empresariales',
                methodology: 'PDCA - Mejora Continua',
                guarantees: 'ROI Medible en 30 días'
            }
        };
        
        this.initDirectContactSystem();
    }

    initDirectContactSystem() {
        this.createContactButton();
        this.createContactModal();
        this.logContactSystemInit();
    }

    createContactButton() {
        // Crear botón de contacto directo en lugar del chatbot
        const contactButton = document.createElement('div');
        contactButton.id = 'direct-contact-button';
        contactButton.innerHTML = `
            <div class="contact-button">
                <div class="contact-icon">📧</div>
                <div class="contact-text">
                    <div class="contact-title">Contacto Directo</div>
                    <div class="contact-subtitle">CEO disponible</div>
                </div>
            </div>
        `;
        
        contactButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ff88, #00ccff);
            border-radius: 15px;
            padding: 15px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            font-family: 'Segoe UI', sans-serif;
            color: #000;
            font-weight: bold;
        `;

        contactButton.addEventListener('mouseenter', () => {
            contactButton.style.transform = 'scale(1.05) translateY(-2px)';
            contactButton.style.boxShadow = '0 12px 30px rgba(0, 255, 136, 0.4)';
        });

        contactButton.addEventListener('mouseleave', () => {
            contactButton.style.transform = 'scale(1) translateY(0)';
            contactButton.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.3)';
        });

        contactButton.addEventListener('click', () => {
            this.openContactModal();
        });

        // Agregar estilos para el contenido interno
        const style = document.createElement('style');
        style.textContent = `
            .contact-button {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .contact-icon {
                font-size: 24px;
                animation: pulse 2s infinite;
            }
            .contact-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .contact-title {
                font-size: 14px;
                font-weight: 700;
            }
            .contact-subtitle {
                font-size: 11px;
                opacity: 0.8;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(contactButton);

        
    }

    createContactModal() {
        const modal = document.createElement('div');
        modal.id = 'direct-contact-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="contact-modal-overlay">
                <div class="contact-modal-content">
                    <div class="contact-header">
                        <h2>💼 Contacto Directo DataCrypt_Labs</h2>
                        <button class="close-modal">×</button>
                    </div>
                    
                    <div class="contact-body">
                        <div class="ceo-info">
                            <div class="ceo-avatar">👨‍💼</div>
                            <div class="ceo-details">
                                <h3>${this.contactInfo.ceo.name}</h3>
                                <p>${this.contactInfo.ceo.title}</p>
                                <div class="specialties">
                                    ${this.contactInfo.ceo.specialties.map(spec => 
                                        `<span class="specialty-tag">${spec}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="contact-options">
                            <div class="contact-option primary">
                                <div class="option-icon">📧</div>
                                <div class="option-details">
                                    <h4>Email Directo</h4>
                                    <p>${this.contactInfo.ceo.email}</p>
                                    <small>Respuesta garantizada en 2-4 horas</small>
                                </div>
                                <button onclick="window.location.href='mailto:${this.contactInfo.ceo.email}?subject=Consulta DataCrypt_Labs&body=Hola Ferney,%0A%0AMe interesa conocer más sobre los servicios de DataCrypt_Labs.%0A%0AMi consulta específica es:%0A%0A[Escribe tu consulta aquí]%0A%0ASaludos'">
                                    Enviar Email
                                </button>
                            </div>
                        </div>

                        <div class="company-guarantees">
                            <h4>🎯 Garantías DataCrypt_Labs</h4>
                            <ul>
                                <li>✅ Consulta inicial gratuita</li>
                                <li>✅ ROI medible en 30 días</li>
                                <li>✅ Metodología PDCA probada</li>
                                <li>✅ 98% satisfacción del cliente</li>
                            </ul>
                        </div>

                        <div class="security-notice">
                            <div class="security-icon">🛡️</div>
                            <div class="security-text">
                                <strong>Comunicación Segura:</strong> Contacto directo sin intermediarios. 
                                Sistema de chatbot desactivado por políticas de seguridad.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Estilos del modal
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            #direct-contact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            .contact-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }
            .contact-modal-content {
                background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                border: 2px solid #00ff88;
                color: #fff;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 20px 40px rgba(0, 255, 136, 0.3);
            }
            .contact-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #00ff88;
                padding-bottom: 15px;
            }
            .contact-header h2 {
                margin: 0;
                color: #00ff88;
            }
            .close-modal {
                background: none;
                border: none;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .close-modal:hover {
                background: #ff4757;
            }
            .ceo-info {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 10px;
            }
            .ceo-avatar {
                font-size: 48px;
            }
            .ceo-details h3 {
                margin: 0 0 5px 0;
                color: #00ccff;
            }
            .ceo-details p {
                margin: 0 0 10px 0;
                color: #ccc;
            }
            .specialties {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .specialty-tag {
                background: #00ff88;
                color: #000;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
            }
            .contact-option {
                background: rgba(0, 204, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .option-icon {
                font-size: 32px;
            }
            .option-details {
                flex: 1;
            }
            .option-details h4 {
                margin: 0 0 5px 0;
                color: #00ccff;
            }
            .option-details p {
                margin: 0 0 5px 0;
                color: #fff;
                font-weight: bold;
            }
            .option-details small {
                color: #ccc;
            }
            .contact-option button {
                background: #00ff88;
                color: #000;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            .contact-option button:hover {
                background: #00ccff;
                transform: scale(1.05);
            }
            .company-guarantees {
                margin: 20px 0;
                padding: 15px;
                background: rgba(0, 255, 136, 0.05);
                border-radius: 10px;
                border-left: 4px solid #00ff88;
            }
            .company-guarantees h4 {
                margin: 0 0 10px 0;
                color: #00ff88;
            }
            .company-guarantees ul {
                margin: 0;
                padding-left: 20px;
            }
            .company-guarantees li {
                margin-bottom: 5px;
                color: #ccc;
            }
            .security-notice {
                display: flex;
                gap: 10px;
                align-items: flex-start;
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid #ffc107;
                border-radius: 8px;
                padding: 10px;
                margin-top: 15px;
            }
            .security-icon {
                font-size: 20px;
            }
            .security-text {
                font-size: 12px;
                color: #ffc107;
            }
        `;
        document.head.appendChild(modalStyles);

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeContactModal();
        });

        modal.querySelector('.contact-modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.contact-modal-overlay')) {
                this.closeContactModal();
            }
        });

        document.body.appendChild(modal);
    }

    openContactModal() {
        const modal = document.getElementById('direct-contact-modal');
        modal.style.display = 'block';
        
        // Log del evento
        
        this.logContactEvent('CONTACT_MODAL_OPENED');
    }

    closeContactModal() {
        const modal = document.getElementById('direct-contact-modal');
        modal.style.display = 'none';
        
        
        this.logContactEvent('CONTACT_MODAL_CLOSED');
    }

    logContactSystemInit() {
        const initEvent = {
            timestamp: Date.now(),
            system: 'DataCryptDirectContact',
            version: '1.0.0',
            ceo: this.contactInfo.ceo.name,
            email: this.contactInfo.ceo.email,
            status: 'ACTIVE'
        };

        
        
        const events = JSON.parse(localStorage.getItem('datacrypt_contact_events') || '[]');
        events.push(initEvent);
        localStorage.setItem('datacrypt_contact_events', JSON.stringify(events.slice(-50)));
    }

    logContactEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        const events = JSON.parse(localStorage.getItem('datacrypt_contact_events') || '[]');
        events.push(event);
        localStorage.setItem('datacrypt_contact_events', JSON.stringify(events.slice(-50)));
    }

    // Método público para obtener información de contacto
    getContactInfo() {
        return this.contactInfo;
    }

    // Método para generar enlace de email personalizado
    generateEmailLink(subject = 'Consulta DataCrypt_Labs', body = '') {
        const defaultBody = `Hola ${this.contactInfo.ceo.name},

Me interesa conocer más sobre los servicios de DataCrypt_Labs.

Mi consulta específica es:

${body}

Saludos`;

        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(defaultBody);
        
        return `mailto:${this.contactInfo.ceo.email}?subject=${encodedSubject}&body=${encodedBody}`;
    }
}

// Auto-inicialización
if (typeof window !== 'undefined') {
    window.DataCryptDirectContact = DataCryptDirectContact;
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.dataCryptDirectContact = new DataCryptDirectContact();
            
        });
    } else {
        window.dataCryptDirectContact = new DataCryptDirectContact();
        
    }
}

export default DataCryptDirectContact;
