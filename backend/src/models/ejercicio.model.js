// Capa de modelo: consultas SQL parametrizadas sobre ejercicios.
const pool = require("../config/db");

const COLUMNS = `id, nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto, activo`;

const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM ejercicios ORDER BY id`);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM ejercicios WHERE id = $1`, [id]);
  return rows[0] || null;
};

const create = async ({ nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto }) => {
  const { rows } = await pool.query(
    `INSERT INTO ejercicios (nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto)
     VALUES ($1, $2, $3, COALESCE($4, 'principiante'), $5)
     RETURNING ${COLUMNS}`,
    [nombre, grupo_muscular, descripcion || null, nivel || null, calorias_por_minuto ?? null]
  );
  return rows[0];
};

const update = async (id, { nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto, activo }) => {
  const { rows } = await pool.query(
    `UPDATE ejercicios
        SET nombre = COALESCE($1, nombre),
            grupo_muscular = COALESCE($2, grupo_muscular),
            descripcion = COALESCE($3, descripcion),
            nivel = COALESCE($4, nivel),
            calorias_por_minuto = COALESCE($5, calorias_por_minuto),
            activo = COALESCE($6, activo)
      WHERE id = $7
      RETURNING ${COLUMNS}`,
    [
      nombre || null,
      grupo_muscular || null,
      descripcion || null,
      nivel || null,
      calorias_por_minuto ?? null,
      activo ?? null,
      id,
    ]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM ejercicios WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };