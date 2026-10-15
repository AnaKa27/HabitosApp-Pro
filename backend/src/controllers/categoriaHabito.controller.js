const model = require("../models/categoriaHabito.model");
const handleDbError = require("../utils/handleDbError");

// GET /api/categorias-habito
const getAll = async (req, res) => {
  try {
    const categorias = await model.findAll();
    res.status(200).json({ data: categorias });
  } catch (err) {
    handleDbError(res, err);
  }
};

// GET /api/categorias-habito/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const categoria = await model.findById(id);
    if (!categoria) {
      return res.status(404).json({ error: `No existe una categoría con id ${id}.` });
    }
    res.status(200).json({ data: categoria });
  } catch (err) {
    handleDbError(res, err);
  }
};

// POST /api/categorias-habito
const create = async (req, res) => {
  try {
    const { nombre, descripcion, color_hex } = req.body;
    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    const nueva = await model.create({ nombre, descripcion, color_hex });
    res.status(201).json({ data: nueva });
  } catch (err) {
    handleDbError(res, err);
  }
};

// PUT /api/categorias-habito/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const { nombre, descripcion, color_hex } = req.body;
    if (nombre === undefined && descripcion === undefined && color_hex === undefined) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar." });
    }
    const actualizada = await model.update(id, { nombre, descripcion, color_hex });
    if (!actualizada) {
      return res.status(404).json({ error: `No existe una categoría con id ${id}.` });
    }
    res.status(200).json({ data: actualizada });
  } catch (err) {
    handleDbError(res, err);
  }
};

// DELETE /api/categorias-habito/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const eliminada = await model.remove(id);
    if (!eliminada) {
      return res.status(404).json({ error: `No existe una categoría con id ${id}.` });
    }
    res.status(200).json({ data: { mensaje: `Categoría ${id} eliminada correctamente.` } });
  } catch (err) {
    handleDbError(res, err);
  }
};

module.exports = { getAll, getById, create, update, remove };
