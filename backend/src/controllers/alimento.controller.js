const model = require("../models/alimento.model");
const handleDbError = require("../utils/handleDbError");

// GET /api/alimentos
const getAll = async (req, res) => {
  try {
    const alimentos = await model.findAll();
    res.status(200).json({ data: alimentos });
  } catch (err) {
    handleDbError(res, err);
  }
};

// GET /api/alimentos/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const alimento = await model.findById(id);
    if (!alimento) {
      return res.status(404).json({ error: `No existe un alimento con id ${id}.` });
    }
    res.status(200).json({ data: alimento });
  } catch (err) {
    handleDbError(res, err);
  }
};

// POST /api/alimentos
const create = async (req, res) => {
  try {
    const { nombre, grupo, calorias_100g, proteinas_100g, carbohidratos_100g, grasas_100g } = req.body;
    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    if (!grupo || typeof grupo !== "string") {
      return res.status(400).json({ error: "El campo 'grupo' es obligatorio y debe ser texto." });
    }
    if (calorias_100g === undefined || isNaN(Number(calorias_100g))) {
      return res.status(400).json({ error: "El campo 'calorias_100g' es obligatorio y debe ser numérico." });
    }
    const nuevo = await model.create({
      nombre,
      grupo,
      calorias_100g,
      proteinas_100g,
      carbohidratos_100g,
      grasas_100g,
    });
    res.status(201).json({ data: nuevo });
  } catch (err) {
    handleDbError(res, err);
  }
};

// PUT /api/alimentos/:id
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
      return res.status(404).json({ error: `No existe un alimento con id ${id}.` });
    }
    res.status(200).json({ data: actualizado });
  } catch (err) {
    handleDbError(res, err);
  }
};

// DELETE /api/alimentos/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const eliminado = await model.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: `No existe un alimento con id ${id}.` });
    }
    res.status(200).json({ data: { mensaje: `Alimento ${id} eliminado correctamente.` } });
  } catch (err) {
    handleDbError(res, err);
  }
};

module.exports = { getAll, getById, create, update, remove };
