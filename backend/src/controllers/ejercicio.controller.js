const model = require("../models/ejercicio.model");
const handleDbError = require("../utils/handleDbError");

const NIVELES = ["principiante", "intermedio", "avanzado"];

// GET /api/ejercicios
const getAll = async (req, res) => {
  try {
    const ejercicios = await model.findAll();
    res.status(200).json({ data: ejercicios });
  } catch (err) {
    handleDbError(res, err);
  }
};

// GET /api/ejercicios/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const ejercicio = await model.findById(id);
    if (!ejercicio) {
      return res.status(404).json({ error: `No existe un ejercicio con id ${id}.` });
    }
    res.status(200).json({ data: ejercicio });
  } catch (err) {
    handleDbError(res, err);
  }
};

// POST /api/ejercicios
const create = async (req, res) => {
  try {
    const { nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto } = req.body;
    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    if (!grupo_muscular || typeof grupo_muscular !== "string") {
      return res.status(400).json({ error: "El campo 'grupo_muscular' es obligatorio y debe ser texto." });
    }
    if (nivel && !NIVELES.includes(nivel)) {
      return res.status(400).json({ error: `El campo 'nivel' debe ser uno de: ${NIVELES.join(", ")}.` });
    }
    const nuevo = await model.create({ nombre, grupo_muscular, descripcion, nivel, calorias_por_minuto });
    res.status(201).json({ data: nuevo });
  } catch (err) {
    handleDbError(res, err);
  }
};

// PUT /api/ejercicios/:id
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
    if (campos.nivel && !NIVELES.includes(campos.nivel)) {
      return res.status(400).json({ error: `El campo 'nivel' debe ser uno de: ${NIVELES.join(", ")}.` });
    }
    const actualizado = await model.update(id, campos);
    if (!actualizado) {
      return res.status(404).json({ error: `No existe un ejercicio con id ${id}.` });
    }
    res.status(200).json({ data: actualizado });
  } catch (err) {
    handleDbError(res, err);
  }
};

// DELETE /api/ejercicios/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "El id debe ser un número entero." });
    }
    const eliminado = await model.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: `No existe un ejercicio con id ${id}.` });
    }
    res.status(200).json({ data: { mensaje: `Ejercicio ${id} eliminado correctamente.` } });
  } catch (err) {
    handleDbError(res, err);
  }
};

module.exports = { getAll, getById, create, update, remove };
