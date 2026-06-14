/**
 * routes/empleos.js
 * GET /api/empleos   — lista de empleos del UNSA_DATA
 * El backend reutiliza los datos de main.js copiados aquí para no duplicar.
 */

const express = require('express');
const path    = require('path');
const router  = express.Router();
const { verifyToken } = require('./auth');

function authMiddleware(req, res, next) {
  const token   = (req.headers.authorization || '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'No autenticado.' });
  req.user = payload;
  next();
}

/* Datos inline (espejo de window.UNSA_DATA.empleos en main.js) */
const EMPLEOS = [
  { id:'JOB-001', puesto:'Analista de Datos', empresa:'BCP', compatibilidad_pct:92, modalidad:'Híbrido', tipo_contrato:'Planilla', ciudad:'Lima', sector:'Finanzas', salario_min:5000, salario_max:7000, verificada:true, fecha_publicacion: new Date(Date.now()-2*3600*1000).toISOString(), habilidades_requeridas:['Python','SQL','Power BI','Estadística','Excel'], descripcion:'Analista de datos para el equipo de inteligencia de negocios del BCP. Reportarás directamente al Gerente de Analytics.' },
  { id:'JOB-002', puesto:'Desarrollador Backend Node.js', empresa:'Yape', compatibilidad_pct:88, modalidad:'Remoto', tipo_contrato:'Planilla', ciudad:'Lima', sector:'Fintech', salario_min:6000, salario_max:9000, verificada:true, fecha_publicacion: new Date(Date.now()-5*3600*1000).toISOString(), habilidades_requeridas:['Node.js','JavaScript','PostgreSQL','Docker','AWS'], descripcion:'Desarrollo y mantenimiento de microservicios para la plataforma de pagos de Yape.' },
  { id:'JOB-003', puesto:'Ingeniero DevOps', empresa:'Intercorp Retail', compatibilidad_pct:79, modalidad:'Presencial', tipo_contrato:'Planilla', ciudad:'Lima', sector:'Retail', salario_min:5500, salario_max:7500, verificada:true, fecha_publicacion: new Date(Date.now()-24*3600*1000).toISOString(), habilidades_requeridas:['Docker','Kubernetes','CI/CD','AWS','Linux'], descripcion:'Gestión de infraestructura cloud y pipelines de despliegue continuo para las plataformas digitales de Intercorp.' },
  { id:'JOB-004', puesto:'Data Scientist Junior', empresa:'BBVA Perú', compatibilidad_pct:85, modalidad:'Híbrido', tipo_contrato:'Planilla', ciudad:'Lima', sector:'Finanzas', salario_min:4500, salario_max:6500, verificada:true, fecha_publicacion: new Date(Date.now()-2*86400*1000).toISOString(), habilidades_requeridas:['Python','Machine Learning','Pandas','SQL','TensorFlow'], descripcion:'Modelado predictivo para la cartera de créditos minoristas del BBVA.' },
  { id:'JOB-005', puesto:'Analista Programador .NET', empresa:'SUNAT', compatibilidad_pct:72, modalidad:'Presencial', tipo_contrato:'CAS', ciudad:'Lima', sector:'Gobierno', salario_min:3500, salario_max:4500, verificada:true, fecha_publicacion: new Date(Date.now()-3*86400*1000).toISOString(), habilidades_requeridas:['C#','.NET','SQL Server','API REST','Azure'], descripcion:'Desarrollo de sistemas tributarios y ventanilla única digital para la SUNAT.' },
  { id:'JOB-006', puesto:'Desarrollador Full Stack React', empresa:'Pacifico Seguros', compatibilidad_pct:81, modalidad:'Híbrido', tipo_contrato:'Planilla', ciudad:'Lima', sector:'Seguros', salario_min:0, salario_max:0, verificada:false, fecha_publicacion: new Date(Date.now()-4*86400*1000).toISOString(), habilidades_requeridas:['React','TypeScript','Node.js','MongoDB','Jest'], descripcion:'Desarrollo de portal de clientes para gestión de pólizas y siniestros.' },
  { id:'JOB-007', puesto:'Practicante de Sistemas', empresa:'Gobierno Regional Arequipa', compatibilidad_pct:68, modalidad:'Presencial', tipo_contrato:'Practicante', ciudad:'Arequipa', sector:'Gobierno', salario_min:1200, salario_max:1500, verificada:true, fecha_publicacion: new Date(Date.now()-5*86400*1000).toISOString(), habilidades_requeridas:['Java','PHP','MySQL','HTML','CSS'], descripcion:'Soporte y desarrollo de sistemas internos para la Gerencia Regional de Sistemas.' },
  { id:'JOB-008', puesto:'Analista de Sistemas', empresa:'Clínica San Pablo', compatibilidad_pct:75, modalidad:'Presencial', tipo_contrato:'Planilla', ciudad:'Arequipa', sector:'Salud', salario_min:3000, salario_max:4000, verificada:true, fecha_publicacion: new Date(Date.now()-7*86400*1000).toISOString(), habilidades_requeridas:['SQL','ERP','SAP','Redes','Soporte Técnico'], descripcion:'Administración del sistema HIS y soporte a usuarios en la Clínica San Pablo Arequipa.' },
];

/* GET /api/empleos */
router.get('/', authMiddleware, (req, res) => {
  let data = [...EMPLEOS];

  if (req.query.ciudad)    data = data.filter(e => e.ciudad === req.query.ciudad);
  if (req.query.modalidad) data = data.filter(e => e.modalidad === req.query.modalidad);
  if (req.query.minMatch)  data = data.filter(e => e.compatibilidad_pct >= parseInt(req.query.minMatch));
  if (req.query.verificada !== undefined) data = data.filter(e => e.verificada === (req.query.verificada === 'true'));

  res.json({ empleos: data, total: data.length });
});

/* GET /api/empleos/:id */
router.get('/:id', authMiddleware, (req, res) => {
  const empleo = EMPLEOS.find(e => e.id === req.params.id);
  if (!empleo) return res.status(404).json({ error: 'Empleo no encontrado.' });
  res.json({ empleo });
});

module.exports = router;
