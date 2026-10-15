-- =====================================================================
--  HabitosApp Pro - Tarea 2 (Segunda entrega)
--  Script de creación de las 4 tablas sobre las que se implementó el
--  CRUD del API REST: categorias_habito, habitos, ejercicios, alimentos.
--
--  Motor: PostgreSQL 13 o superior
--  Nota: estas tablas son un subconjunto del modelo completo de la
--  primera entrega (database/schema.sql). Se omite aquí la columna
--  habitos.creado_por (y su llave foránea a "usuarios") porque la
--  tabla usuarios no forma parte del alcance de esta tarea, que no
--  incluye autenticación.
--
--  Uso:
--    createdb habitosapp_tarea2
--    psql -d habitosapp_tarea2 -f tarea2_schema.sql
-- =====================================================================

-- Para reiniciar (¡borra todo!):
-- DROP TABLE IF EXISTS habitos, categorias_habito, ejercicios, alimentos CASCADE;

-- ---------------------------------------------------------------------
-- Tabla 1: categorias_habito
-- ---------------------------------------------------------------------
CREATE TABLE categorias_habito (
  id           SERIAL PRIMARY KEY,
  nombre       VARCHAR(50)  NOT NULL UNIQUE,
  descripcion  VARCHAR(255),
  color_hex    CHAR(7)      NOT NULL DEFAULT '#4CAF50',
  CONSTRAINT chk_cat_color CHECK (color_hex ~ '^#[0-9A-Fa-f]{6}$')
);

-- ---------------------------------------------------------------------
-- Tabla 2: habitos (depende de categorias_habito)
-- ---------------------------------------------------------------------
CREATE TABLE habitos (
  id                    SERIAL PRIMARY KEY,
  categoria_id          INTEGER      NOT NULL REFERENCES categorias_habito(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  nombre                VARCHAR(100) NOT NULL,
  descripcion           TEXT,
  unidad_medida         VARCHAR(20)  NOT NULL DEFAULT 'veces',
  meta_diaria_sugerida  NUMERIC(8,2) NOT NULL DEFAULT 1,
  es_predefinido        BOOLEAN      NOT NULL DEFAULT FALSE,
  activo                BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_habito_categoria_nombre UNIQUE (categoria_id, nombre),
  CONSTRAINT chk_habito_meta CHECK (meta_diaria_sugerida > 0)
);

-- ---------------------------------------------------------------------
-- Tabla 3: ejercicios (independiente)
-- ---------------------------------------------------------------------
CREATE TABLE ejercicios (
  id                   SERIAL PRIMARY KEY,
  nombre               VARCHAR(100) NOT NULL UNIQUE,
  grupo_muscular       VARCHAR(40)  NOT NULL,
  descripcion          TEXT,
  nivel                VARCHAR(15)  NOT NULL DEFAULT 'principiante',
  calorias_por_minuto  NUMERIC(5,2),
  activo               BOOLEAN      NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_ejercicio_nivel CHECK (nivel IN ('principiante','intermedio','avanzado')),
  CONSTRAINT chk_ejercicio_calorias CHECK (calorias_por_minuto IS NULL OR calorias_por_minuto > 0)
);

-- ---------------------------------------------------------------------
-- Tabla 4: alimentos (independiente)
-- ---------------------------------------------------------------------
CREATE TABLE alimentos (
  id                  SERIAL PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL UNIQUE,
  grupo               VARCHAR(40)  NOT NULL,
  calorias_100g       NUMERIC(6,2) NOT NULL,
  proteinas_100g      NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbohidratos_100g  NUMERIC(6,2) NOT NULL DEFAULT 0,
  grasas_100g         NUMERIC(6,2) NOT NULL DEFAULT 0,
  activo              BOOLEAN      NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_alimento_calorias CHECK (calorias_100g >= 0),
  CONSTRAINT chk_alimento_macros CHECK (proteinas_100g >= 0 AND carbohidratos_100g >= 0 AND grasas_100g >= 0)
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX idx_habitos_categoria ON habitos(categoria_id);

-- =====================================================================
--  Datos de prueba
-- =====================================================================

INSERT INTO categorias_habito (nombre, descripcion, color_hex) VALUES
  ('Salud general', 'Hidratación, sueño y cuidados básicos',   '#2196F3'),
  ('Nutrición',     'Alimentación balanceada y consciente',    '#4CAF50'),
  ('Fitness',       'Actividad física y ejercicio',            '#FF9800'),
  ('Salud mental',  'Manejo del estrés, descanso y bienestar', '#9C27B0');

INSERT INTO habitos (categoria_id, nombre, descripcion, unidad_medida, meta_diaria_sugerida, es_predefinido) VALUES
  (1, 'Beber agua',             'Mantener una buena hidratación durante el día', 'vasos',    8,    TRUE),
  (1, 'Dormir bien',            'Horas de sueño reparador por noche',            'horas',    8,    TRUE),
  (2, 'Comer frutas y verduras','Porciones de frutas y verduras al día',         'porciones',5,    TRUE),
  (3, 'Caminar',                'Pasos caminados en el día',                     'pasos',    8000, TRUE),
  (4, 'Meditar',                'Minutos de meditación o respiración consciente','minutos',  10,   TRUE);

INSERT INTO ejercicios (nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto) VALUES
  ('Sentadilla', 'Piernas', 'Flexión de rodillas con la espalda recta',          'principiante', 6.0),
  ('Flexiones',  'Pecho',   'Flexión de brazos apoyando manos y puntas de pies', 'principiante', 7.0),
  ('Plancha',    'Core',    'Isométrico de abdomen apoyado en antebrazos',       'principiante', 4.0),
  ('Burpees',    'Cuerpo completo', 'Secuencia de sentadilla, plancha y salto',  'avanzado',    10.0);

INSERT INTO alimentos (nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g) VALUES
  ('Arroz blanco cocido',     'Cereales',  130, 2.7, 28.0, 0.3),
  ('Pechuga de pollo cocida', 'Proteínas', 165, 31.0, 0.0, 3.6),
  ('Banano',                  'Frutas',    89,  1.1, 23.0, 0.3),
  ('Avena en hojuelas',       'Cereales',  389, 16.9, 66.0, 6.9);
