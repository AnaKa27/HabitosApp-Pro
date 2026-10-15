// Capa de modelo: consultas SQL parametrizadas sobre alimentos.
const pool = require("../config/db");

const COLUMNS = `id, nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g, activo`;

const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM alimentos ORDER BY id`);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM alimentos WHERE id = $1`, [id]);
  return rows[0] || null;
};

const create = async ({ nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g }) => {
  const { rows } = await pool.query(
    `INSERT INTO alimentos (nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g)
     VALUES ($1, $2, $3, COALESCE($4, 0), COALESCE($5, 0), COALESCE($6, 0))
     RETURNING ${COLUMNS}`,
    [
      nombre,
      grupo,
      calorias_100g,
      proteinas_100g ?? null,
      carbohidratos_100g ?? null,
      grasas_100g ?? null,
    ]
  );
  return rows[0];
};

const update = async (
  id,
  { nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g, activo }
) => {
  const { rows } = await pool.query(
    `UPDATE alimentos
        SET nombre = COALESCE($1, nombre),
            grupo = COALESCE($2, grupo),
            calorias_100g = COALESCE($3, calorias_100g),
            proteinas_100g = COALESCE($4, proteinas_100g),
            carbohidratos_100g = COALESCE($5, carbohidratos_100g),
            grasas_100g = COALESCE($6, grasas_100g),
            activo = COALESCE($7, activo)
      WHERE id = $8
      RETURNING ${COLUMNS}`,
    [
      nombre || null,
      grupo || null,
      calorias_100g ?? null,
      proteinas_100g ?? null,
      carbohidratos_100g ?? null,
      grasas_100g ?? null,
      activo ?? null,
      id,
    ]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM alimentos WHERE id = $1", [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
