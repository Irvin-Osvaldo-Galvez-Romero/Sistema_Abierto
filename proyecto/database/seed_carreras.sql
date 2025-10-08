-- =====================================================
-- SEED DE CARRERAS
-- Inserta carreras de ejemplo para el sistema
-- =====================================================

-- Limpiar carreras existentes (opcional)
-- DELETE FROM carreras;

-- Insertar carreras universitarias comunes
INSERT INTO carreras (id, clave, nombre, descripcion, "duracionSemestres", creditos, modalidad, activo, "createdAt", "updatedAt")
VALUES 
  -- Ingenierías
  (
    gen_random_uuid(),
    'ISC',
    'Ingeniería en Sistemas Computacionales',
    'Formación de profesionales en el desarrollo de software, redes y sistemas de información',
    9,
    300,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'II',
    'Ingeniería Industrial',
    'Formación de profesionales en optimización de procesos productivos y logística',
    9,
    300,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'IE',
    'Ingeniería Electrónica',
    'Formación de profesionales en diseño y desarrollo de sistemas electrónicos',
    9,
    300,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'IM',
    'Ingeniería Mecánica',
    'Formación de profesionales en diseño, análisis y manufactura de sistemas mecánicos',
    9,
    300,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'IC',
    'Ingeniería Civil',
    'Formación de profesionales en diseño y construcción de infraestructura',
    10,
    350,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  
  -- Licenciaturas
  (
    gen_random_uuid(),
    'LA',
    'Licenciatura en Administración',
    'Formación de profesionales en gestión empresarial y administrativa',
    8,
    280,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'LC',
    'Licenciatura en Contaduría',
    'Formación de profesionales en contabilidad, auditoría y finanzas',
    8,
    280,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'LMKT',
    'Licenciatura en Mercadotecnia',
    'Formación de profesionales en estrategias de marketing y comercialización',
    8,
    280,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'LD',
    'Licenciatura en Derecho',
    'Formación de profesionales en ciencias jurídicas y legislación',
    9,
    320,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'LP',
    'Licenciatura en Psicología',
    'Formación de profesionales en psicología clínica, educativa y organizacional',
    8,
    280,
    'PRESENCIAL',
    true,
    NOW(),
    NOW()
  );

-- Verificar las carreras insertadas
SELECT * FROM carreras ORDER BY nombre;


