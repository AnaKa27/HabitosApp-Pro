// Capa de controlador: validaciones y códigos de estado para /api/habitos.
const model = require("../models/habito.model");
const handleDbError = require("../utils/handleDbError");

const esEntero = (v) => Number.isInteger(Number(v)) && Number(v) > 0 && String(v).trim() !== "";
const esTextoNoVacio = (v) => typeof v === "string" && v.trim() !== "";

// Valida los campos opcionales comunes a POST y PUT. Devuelve un mensaje de error o null.
const validarCamposOpcionales = (c) => {
  if (c.descripcion !== undefined && c.descripcion !== null && typeof c.descripcion !== "string") {
    return "El campo 'descripcion' debe ser texto.";
  }
  if (c.unidad_medida !== undefined && (!esTextoNoVacio(c.unidad_medida) || c.unidad_medida.length > 20)) {
    return "El campo 'unidad_medida' debe ser texto no vacío de máximo 20 caracteres.";
  }
  if (c.nombre !== undefined && c.nombre.length > 100) {
    return "El campo 'nombre' no puede superar 100 caracteres.";
  }
  if (c.meta_diaria_sugerida !== undefined) {
    const meta = Number(c.meta_diaria_sugerida);
    if (c.meta_diaria_sugerida === null || c.meta_diaria_sugerida === "" || !Number.isFinite(meta) || meta <= 0) {
      return "El campo 'meta_diaria_sugerida' debe ser un número mayor que 0.";
    }
  }
  for (const campo of ["es_predefinido", "activo"]) {
    if (c[campo] !== undefined && typeof c[campo] !== "boolean") {
      return `El campo '${campo}' debe ser booleano (true o false).`;
    }
  }
  return null;
};

// Valida que categoria_id tenga formato correcto Y exista en categorias_habito.
// Devuelve un mensaje de error o null si es válida.
const validarCategoria = async (categoria_id) => {
  if (!esEntero(categoria_id)) {
    return "El campo 'categoria_id' debe ser un número entero positivo.";
  }
  if (!(await model.categoriaExists(Number(categoria_id)))) {
    return `La categoría con id ${categoria_id} no existe en categorias_habito.`;
  }
  return null;
};

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
    if (!esEntero(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero positivo." });
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
    const body = req.body || {};
    const { categoria_id, nombre, descripcion, unidad_medida, meta_diaria_sugerida, es_predefinido } = body;

    if (categoria_id === undefined || categoria_id === null) {
      return res.status(400).json({ error: "El campo 'categoria_id' es obligatorio." });
    }
    if (!esTextoNoVacio(nombre)) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio y debe ser texto." });
    }
    const errorCampos = validarCamposOpcionales(body);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    const errorCategoria = await validarCategoria(categoria_id);
    if (errorCategoria) return res.status(400).json({ error: errorCategoria });

    const nuevo = await model.create({
      categoria_id: Number(categoria_id),
      nombre: nombre.trim(),
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
    if (!esEntero(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero positivo." });
    }
    const body = req.body || {};
    const permitidos = ["categoria_id", "nombre", "descripcion", "unidad_medida", "meta_diaria_sugerida", "es_predefinido", "activo"];
    const campos = Object.fromEntries(Object.entries(body).filter(([k]) => permitidos.includes(k)));
    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ error: "Debe enviar al menos un campo válido para actualizar." });
    }
    if (campos.nombre !== undefined && !esTextoNoVacio(campos.nombre)) {
      return res.status(400).json({ error: "El campo 'nombre' debe ser texto no vacío." });
    }
    const errorCampos = validarCamposOpcionales(campos);
    if (errorCampos) return res.status(400).json({ error: errorCampos });

    if (campos.categoria_id !== undefined) {
      const errorCategoria = await validarCategoria(campos.categoria_id);
      if (errorCategoria) return res.status(400).json({ error: errorCategoria });
      campos.categoria_id = Number(campos.categoria_id);
    }
    if (campos.nombre !== undefined) campos.nombre = campos.nombre.trim();

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
    if (!esEntero(id)) {
      return res.status(400).json({ error: "El id debe ser un número entero positivo." });
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
