// Capa de modelo: consultas SQL parametrizadas sobre habitos.
const pool = require("../config/db");

const COLUMNS = `id, categoria_id, nombre, descripcion, unidad_medida,
                 meta_diaria_sugerida, es_predefinido, activo, created_at`;

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM habitos ORDER BY id`
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM habitos WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({
  categoria_id,
  nombre,
  descripcion,
  unidad_medida,
  meta_diaria_sugerida,
  es_predefinido,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO habitos (categoria_id, nombre, descripcion, unidad_medida, meta_diaria_sugerida, es_predefinido)
     VALUES ($1, $2, $3, COALESCE($4, 'veces'), COALESCE($5, 1), COALESCE($6, FALSE))
     RETURNING ${COLUMNS}`,
    [
      categoria_id,
      nombre,
      descripcion || null,
      unidad_medida || null,
      meta_diaria_sugerida ?? null,
      es_predefinido ?? null,
    ]
  );
  return rows[0];
};

const update = async (
  id,
  { categoria_id, nombre, descripcion, unidad_medida, meta_diaria_sugerida, es_predefinido, activo }
) => {
  const { rows } = await pool.query(
    `UPDATE habitos
        SET categoria_id = COALESCE($1, categoria_id),
            nombre = COALESCE($2, nombre),
            descripcion = COALESCE($3, descripcion),
            unidad_medida = COALESCE($4, unidad_medida),
            meta_diaria_sugerida = COALESCE($5, meta_diaria_sugerida),
            es_predefinido = COALESCE($6, es_predefinido),
            activo = COALESCE($7, activo)
      WHERE id = $8
      RETURNING ${COLUMNS}`,
    [
      categoria_id ?? null,
      nombre || null,
      descripcion || null,
      unidad_medida || null,
      meta_diaria_sugerida ?? null,
      es_predefinido ?? null,
      activo ?? null,
      id,
    ]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM habitos WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
