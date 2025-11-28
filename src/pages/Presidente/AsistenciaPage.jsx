import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Checkbox, Spinner, Alert } from 'flowbite-react';
import { HiArrowLeft, HiSave, HiUserGroup, HiDownload } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx-js-style';

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-400 text-lg mb-6">
            No tienes permisos para ver esta página. Solo el Presidente puede gestionar la asistencia.
        </p>
        <Button color="gray" href="/dashboard/presidente/proyectos">Volver a Proyectos</Button>
    </div>
);

export default function AsistenciaPage() {
    const { proyectoId } = useParams();
    const navigate = useNavigate();
    const [asistencias, setAsistencias] = useState([]);
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Simulación de rol
    const userRole = "PRESIDENTE";

    useEffect(() => {
        if (userRole === "PRESIDENTE") {
            fetchProyecto();
            fetchAsistencias();
        }
    }, [proyectoId]);

    const fetchProyecto = async () => {
        try {
            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/public/${proyectoId}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Estado del proyecto:', data.estadoProyecto);
                setProyecto(data);
            }
        } catch (err) {
            console.error('Error al cargar el proyecto:', err);
        }
    };

    const fetchAsistencias = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/${proyectoId}/asistencias`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            );

            if (!response.ok) throw new Error('Error al cargar la lista de asistencia');

            const data = await response.json();
            setAsistencias(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePresente = (usuarioId) => {
        setAsistencias(prev =>
            prev.map(a =>
                a.usuarioId === usuarioId ? { ...a, presente: !a.presente } : a
            )
        );
    };

    const guardarAsistencia = async () => {
        setSaving(true);
        setSuccessMsg(null);
        setError(null);

        const usuariosPresentesIds = asistencias
            .filter(a => a.presente)
            .map(a => a.usuarioId);

        const payload = { usuariosPresentesIds };

        try {
            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/${proyectoId}/asistencia/guardar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) throw new Error('Error al guardar la asistencia');

            setSuccessMsg('Asistencia guardada correctamente');

            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La asistencia se ha registrado con éxito.',
                confirmButtonColor: '#8B0036'
            });
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
                confirmButtonColor: '#8B0036'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleExportarExcel = () => {
        try {
            // Prepare data with enhanced formatting
            const projectTitle = proyecto?.titulo || 'Proyecto';
            const fechaExportacion = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Create header rows
            const headerData = [
                ['ROTARACT DISTRITO 4465'],
                ['REPORTE DE ASISTENCIAS'],
                [`Proyecto: ${projectTitle}`],
                [`Fecha de exportación: ${fechaExportacion}`],
                [], // Empty row for spacing
                ['ID Usuario', 'Nombre Completo', 'Correo Electrónico', 'Estado de Asistencia']
            ];

            // Map attendance data
            const attendanceData = asistencias.map(item => [
                item.usuarioId,
                item.usuarioNombreCompleto,
                item.usuarioCorreo,
                item.presente ? 'PRESENTE' : 'FALTA'
            ]);

            // Combine all data
            const allData = [...headerData, ...attendanceData];

            // Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(allData);

            // Set column widths
            ws['!cols'] = [
                { wch: 12 },  // ID Usuario
                { wch: 30 },  // Nombre
                { wch: 35 },  // Correo
                { wch: 20 }   // Estado
            ];

            // Merge cells for title
            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
                { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Subtitle row
                { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // Project name
                { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }  // Date
            ];

            // Apply styles to cells
            const range = XLSX.utils.decode_range(ws['!ref']);

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!ws[cellAddress]) continue;

                    // Initialize cell style
                    ws[cellAddress].s = {};

                    // Title styling (row 0)
                    if (R === 0) {
                        ws[cellAddress].s = {
                            font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "8B0036" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }

                    // Subtitle styling (row 1)
                    if (R === 1) {
                        ws[cellAddress].s = {
                            font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "A0153E" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }

                    // Project name styling (row 2)
                    if (R === 2) {
                        ws[cellAddress].s = {
                            font: { bold: true, sz: 12, color: { rgb: "000000" } },
                            fill: { fgColor: { rgb: "E8E8E8" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }

                    // Date styling (row 3)
                    if (R === 3) {
                        ws[cellAddress].s = {
                            font: { italic: true, sz: 10, color: { rgb: "666666" } },
                            fill: { fgColor: { rgb: "F5F5F5" } },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }

                    // Header row styling (row 5)
                    if (R === 5) {
                        ws[cellAddress].s = {
                            font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "4472C4" } },
                            alignment: { horizontal: "center", vertical: "center" },
                            border: {
                                top: { style: "thin", color: { rgb: "000000" } },
                                bottom: { style: "thin", color: { rgb: "000000" } },
                                left: { style: "thin", color: { rgb: "000000" } },
                                right: { style: "thin", color: { rgb: "000000" } }
                            }
                        };
                    }

                    // Data rows styling (row 6+)
                    if (R > 5) {
                        const cellValue = ws[cellAddress].v;

                        // Alternating row colors
                        const bgColor = (R % 2 === 0) ? "FFFFFF" : "F2F2F2";

                        ws[cellAddress].s = {
                            fill: { fgColor: { rgb: bgColor } },
                            alignment: { horizontal: C === 0 ? "center" : "left", vertical: "center" },
                            border: {
                                top: { style: "thin", color: { rgb: "CCCCCC" } },
                                bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                                left: { style: "thin", color: { rgb: "CCCCCC" } },
                                right: { style: "thin", color: { rgb: "CCCCCC" } }
                            }
                        };

                        // Estado column (column D) - conditional formatting
                        if (C === 3) {
                            if (cellValue === 'PRESENTE') {
                                ws[cellAddress].s.font = { bold: true, color: { rgb: "006100" } };
                                ws[cellAddress].s.fill = { fgColor: { rgb: "C6EFCE" } };
                            } else if (cellValue === 'FALTA') {
                                ws[cellAddress].s.font = { bold: true, color: { rgb: "9C0006" } };
                                ws[cellAddress].s.fill = { fgColor: { rgb: "FFC7CE" } };
                            }
                        }
                    }
                }
            }

            // Create workbook and add worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

            // Generate and download file
            XLSX.writeFile(wb, `asistencias_proyecto_${proyectoId}.xlsx`, {
                bookType: 'xlsx',
                cellStyles: true
            });

            // Show success message
            Swal.fire({
                icon: 'success',
                title: '¡Descargado!',
                text: 'El archivo Excel se ha generado correctamente.',
                confirmButtonColor: '#8B0036',
                timer: 2000
            });
        } catch (error) {
            console.error('Error al exportar Excel:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo generar el archivo Excel.',
                confirmButtonColor: '#8B0036'
            });
        }
    };

    if (userRole !== "PRESIDENTE") {
        return <AccessDenied />;
    }

    return (
        <div className="pt-20 pb-16 min-h-screen bg-neutral-950">
            <div className="max-w-4xl mx-auto px-4">

                {/* Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        color="gray"
                        size="sm"
                        onClick={() => navigate('/presidente/proyectos')}
                        className="flex items-center gap-2"
                    >
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Proyectos
                    </Button>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white mb-2">
                                Registro de Asistencia
                            </h1>
                            <p className="text-gray-400">
                                Gestiona la asistencia de los socios inscritos en este proyecto.
                            </p>
                        </div>

                        {/* Export Excel Button - Only show if project is FINALIZADO */}
                        {proyecto?.estadoProyecto === 'FINALIZADO' && (
                            <Button
                                color="success"
                                onClick={handleExportarExcel}
                                size="lg"
                            >
                                <HiDownload className="mr-2 h-5 w-5" />
                                Exportar Excel
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Error / Success */}
                {error && (
                    <Alert color="failure" className="mb-6" onDismiss={() => setError(null)}>
                        <span className="font-medium">Error:</span> {error}
                    </Alert>
                )}
                {successMsg && (
                    <Alert color="success" className="mb-6" onDismiss={() => setSuccessMsg(null)}>
                        <span className="font-medium">Éxito:</span> {successMsg}
                    </Alert>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="xl" color="pink" />
                    </div>
                ) : asistencias.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
                        <HiUserGroup className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                        <p className="text-gray-400 text-lg">No hay socios inscritos en este proyecto.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4">
                            {asistencias.map((socio) => (
                                <Card
                                    key={socio.usuarioId}
                                    className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h5 className="text-lg font-bold tracking-tight text-white">
                                                {socio.usuarioNombreCompleto}
                                            </h5>
                                            <p className="font-normal text-gray-400 text-sm">
                                                {socio.usuarioCorreo}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label
                                                htmlFor={`attendance-${socio.usuarioId}`}
                                                className={`text-sm font-medium ${socio.presente ? 'text-green-400' : 'text-gray-500'}`}
                                            >
                                                {socio.presente ? 'Presente' : 'Ausente'}
                                            </label>

                                            <Checkbox
                                                id={`attendance-${socio.usuarioId}`}
                                                checked={socio.presente}
                                                onChange={() => togglePresente(socio.usuarioId)}
                                                className="w-6 h-6 text-primary-600 bg-neutral-800 border-neutral-600 focus:ring-primary-600 focus:ring-2"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-6 bg-neutral-950/80 backdrop-blur-sm p-4 rounded-xl border border-neutral-800 flex justify-end gap-4 shadow-lg">
                            <Button
                                color="gray"
                                onClick={() => navigate('/presidente/proyectos')}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onClick={guardarAsistencia}
                                isProcessing={saving}
                                disabled={saving || proyecto?.estadoProyecto === 'FINALIZADO'}
                                className="bg-[#8B0036] hover:bg-[#6d002a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title={proyecto?.estadoProyecto === 'FINALIZADO' ? 'No se puede guardar asistencia en proyectos finalizados' : ''}
                            >
                                <HiSave className="mr-2 h-5 w-5" />
                                {proyecto?.estadoProyecto === 'FINALIZADO' ? 'Proyecto Finalizado' : 'Guardar Asistencia'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
