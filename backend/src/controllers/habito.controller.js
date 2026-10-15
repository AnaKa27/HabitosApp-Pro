const model = require("../models/habito.model");
const handleDbError = require("../utils/handleDbError");

// GET /api/habitos
const getAll = async (req, res) => {
  try {
    const habitos = await model.findAll();
    res.status(200).json({ data: habitos });
  } catch (err) {
    handleDbError(res, err);
  }
};

// GET /api/habitos/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const habito = await model.findById(id);
    if (!habito) {
      return res.status(404).json({ error: `No existe un hábito con id ${id}.` });
    }
    res.status(200).json({ data: habito });
  } catch (err) {
    handleDbError(res, err);
  }
};

// POST /api/habitos
const create = async (req, res) => {
  try {
    const { categoria_id, nombre, descripcion, unidad_medida, meta_diaria_sugerida, es_predefinido } = req.body;
    if (!categoria_id || !Number.isInteger(Number(categoria_id))) {
      return res.status(400).json({ error: "El campo 'categoria_id' es obligatorio y debe ser un número entero." });
    }
    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    const nuevo = await model.create({
      categoria_id,
      nombre,
      descripcion,
      unidad_medida,
      meta_diaria_sugerida,
      es_predefinido,
    });
    res.status(201).json({ data: nuevo });
  } catch (err) {
    handleDbError(res, err);
  }
};

// PUT /api/habitos/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const campos = req.body;
    if (!campos || Object.keys(campos).length === 0) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar." });
    }
    const actualizado = await model.update(id, campos);
    if (!actualizado) {
      return res.status(404).json({ error: `No existe un hábito con id ${id}.` });
    }
    res.status(200).json({ data: actualizado });
  } catch (err) {
    handleDbError(res, err);
  }
};

// DELETE /api/habitos/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const eliminado = await model.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: `No existe un hábito con id ${id}.` });
    }
    res.status(200).json({ data: { mensaje: `Hábito ${id} eliminado correctamente.` } });
  } catch (err) {
    handleDbError(res, err);
  }
};

module.exports = { getAll, getById, create, update, remove };
