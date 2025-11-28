import { useState } from 'react';
import { Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

/**
 * ConfirmarCancelacionButton Component
 * Reusable button with 10-second countdown confirmation for canceling actions
 */
export default function ConfirmarCancelacionButton({
    onConfirm,
    titulo,
    descripcion,
    disabled = false,
    buttonText = 'Cancelar',
    buttonSize = 'sm',
    buttonColor = 'failure'
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = () => {
        let timerInterval;
        let countdown = 10;

        Swal.fire({
            title: `Cancelar: ${titulo}`,
            html: `
                <div style="text-align: left; margin-bottom: 20px;">
                    <p style="font-weight: 600; margin-bottom: 10px; color: #dc2626;">
                        ${descripcion}
                    </p>
                    <p style="font-weight: 600; margin-bottom: 8px;">Advertencia:</p>
                    <ul style="list-style: disc; padding-left: 20px; margin-bottom: 0;">
                        <li>Esta acción <strong>no se puede deshacer</strong></li>
                        <li>El elemento quedará <strong>cancelado permanentemente</strong></li>
                        <li>Se notificará a todos los participantes</li>
                    </ul>
                </div>
                <div style="padding: 15px; background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; margin-bottom: 10px;">
                    <p style="font-size: 32px; font-weight: bold; color: #d97706; margin: 0;">
                        <span id="countdown">${countdown}</span>
                    </p>
                    <p style="font-size: 14px; color: #92400e; margin: 5px 0 0 0;">
                        Puedes confirmar en <strong id="countdown-text">${countdown}</strong> segundo${countdown !== 1 ? 's' : ''}
                    </p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Cancelación',
            cancelButtonText: 'Volver',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6B7280',
            background: '#171717',
            color: '#ffffff',
            customClass: {
                popup: 'swal-dark-popup',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.disabled = true;
                confirmButton.style.opacity = '0.5';
                confirmButton.style.cursor = 'not-allowed';

                timerInterval = setInterval(() => {
                    countdown--;
                    const countdownElement = document.getElementById('countdown');
                    const countdownText = document.getElementById('countdown-text');

                    if (countdownElement) {
                        countdownElement.textContent = countdown;
                    }
                    if (countdownText) {
                        countdownText.textContent = countdown;
                    }

                    if (countdown <= 0) {
                        clearInterval(timerInterval);
                        confirmButton.disabled = false;
                        confirmButton.style.opacity = '1';
                        confirmButton.style.cursor = 'pointer';

                        const htmlContent = Swal.getHtmlContainer();
                        if (htmlContent) {
                            const countdownDiv = htmlContent.querySelector('div[style*="background: #fef3c7"]');
                            if (countdownDiv) {
                                countdownDiv.innerHTML = `
                                    <p style="font-size: 18px; font-weight: 600; color: #16a34a; margin: 0;">
                                        Ahora puedes confirmar la cancelación
                                    </p>
                                `;
                                countdownDiv.style.background = '#dcfce7';
                                countdownDiv.style.border = '2px solid #16a34a';
                            }
                        }
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsProcessing(true);
                try {
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Por favor espera',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    await onConfirm();

                    Swal.close();
                } catch (error) {
                    // Error handling is done in the parent component
                    console.error('Error in confirmation:', error);
                } finally {
                    setIsProcessing(false);
                }
            }
        });
    };

    return (
        <Button
            size={buttonSize}
            color={buttonColor}
            onClick={handleClick}
            disabled={disabled || isProcessing}
            className="bg-red-600 hover:bg-red-700"
        >
            <HiX className="w-4 h-4 mr-1" />
            {buttonText}
        </Button>
    );
}

ConfirmarCancelacionButton.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonSize: PropTypes.string,
    buttonColor: PropTypes.string
};
