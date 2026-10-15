// Traduce los errores más comunes de PostgreSQL (por código SQLSTATE) a una
// respuesta HTTP con el código de estado adecuado. Se usa en los catch de
// todos los controladores para no repetir esta lógica.
function handleDbError(res, err) {
  console.error(err);

  // 23505 = unique_violation, 23503 = foreign_key_violation, 23514 = check_violation
  if (["23505", "23503", "23514"].includes(err.code)) {
    const mensajes = {
      23505: "Ya existe un registro con ese valor único (nombre duplicado).",
      23503: "La operación viola una relación con otra tabla (llave foránea inválida o registro en uso).",
      23514: "El valor enviado no cumple una restricción de validación.",
    };
    return res.status(400).json({ error: mensajes[err.code], detalle: err.detail });
  }

  return res.status(500).json({ error: "Error interno del servidor." });
}

module.exports = handleDbError;
