-- Patch de datos (una sola vez): rellena los campos nuevos en ofertas ya publicadas
-- para que el demo muestre filtros y contacto. Coincidencia por título.

update ofertas set tipo_empleo='Full-time', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Arequipa', distrito='Remoto',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Equipo RR.HH.', contacto_email='rrhh@techcorp.pe', contacto_telefono='959111222'
  where titulo='Desarrollador Frontend Junior';

update ofertas set tipo_empleo='Full-time', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Caylloma', distrito='Majes',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Oficina de Personal', contacto_email='seleccion@constructorasur.pe', contacto_telefono='958222333'
  where titulo='Ingeniero Civil Asistente';

update ofertas set tipo_empleo='Part-time', nivel_jerarquia='Pasante/Interno', ciudad='Arequipa', provincia='Arequipa', distrito='Yanahuara',
  dirigido_a=array['Últimos años','Prácticas']::text[], contacto_nombre='Estudio Contable Medina', contacto_email='practicas@medina.pe', contacto_telefono='957333444'
  where titulo ilike 'Practicante Pre Profesional de Contabilidad%' or titulo ilike 'Practicante Contable%';

update ofertas set tipo_empleo='Full-time', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Caylloma', distrito='Campamento',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Reclutamiento Minera Andina', contacto_email='rrhh@mineraandina.pe', contacto_telefono='956444555'
  where titulo='Geólogo Junior';

update ofertas set tipo_empleo='Full-time', nivel_jerarquia='Senior/Semi-senior', ciudad='Arequipa', provincia='Arequipa', distrito='José Luis Bustamante y Rivero',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Selección Banco Regional', contacto_email='talento@bancoregional.pe', contacto_telefono='955555666'
  where titulo='Analista de Datos Senior';

update ofertas set tipo_empleo='Freelance', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Arequipa', distrito='Arequipa (Cercado)',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Estudio ARQ Arequipa', contacto_email='proyectos@arqarequipa.pe', contacto_telefono='954666777'
  where titulo ilike 'Arquitecto%';

update ofertas set tipo_empleo='Part-time', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Arequipa', distrito='Arequipa (Cercado)',
  dirigido_a=array['Egresado']::text[], contacto_nombre='Dirección Colegio San Francisco', contacto_email='admin@colegiosanfrancisco.pe', contacto_telefono='953777888'
  where titulo='Enfermera Licenciada';

update ofertas set tipo_empleo='Full-time', nivel_jerarquia='Junior', ciudad='Arequipa', provincia='Arequipa', distrito='Remoto',
  dirigido_a=array['Egresado','Últimos años']::text[], contacto_nombre='Agencia Digital Click', contacto_email='hola@agenciaclick.pe', contacto_telefono='952888999'
  where titulo='Community Manager Junior';
