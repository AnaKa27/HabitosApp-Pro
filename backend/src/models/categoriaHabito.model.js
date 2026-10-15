// Capa de modelo: consultas SQL parametrizadas sobre categorias_habito.
const pool = require("../config/db");

const findAll = async () => {
  const { rows } = await pool.query(
    "SELECT id, nombre, descripcion, color_hex FROM categorias_habito ORDER BY id"
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, nombre, descripcion, color_hex FROM categorias_habito WHERE id = $1",
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nombre, descripcion, color_hex }) => {
  const { rows } = await pool.query(
    `INSERT INTO categorias_habito (nombre, descripcion, color_hex)
     VALUES ($1, $2, COALESCE($3, '#4CAF50'))
     RETURNING id, nombre, descripcion, color_hex`,
    [nombre, descripcion || null, color_hex || null]
  );
  return rows[0];
};

const update = async (id, { nombre, descripcion, color_hex }) => {
  const { rows } = await pool.query(
    `UPDATE categorias_habito
        SET nombre = COALESCE($1, nombre),
            descripcion = COALESCE($2, descripcion),
            color_hex = COALESCE($3, color_hex)
      WHERE id = $4
      RETURNING id, nombre, descripcion, color_hex`,
    [nombre || null, descripcion || null, color_hex || null, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query(
    "DELETE FROM categorias_habito WHERE id = $1",
    [id]
  );
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
