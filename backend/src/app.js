const express = require("express");
const apiRoutes = require("./routes");

const app = express();

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// Endpoint para verificar el estado de la API y consultar sus rutas
app.get("/", (req, res) => {
  res.status(200).json({
    data: {
      mensaje: "API de HabitosApp Pro funcionando correctamente.",
      rutas: {
        categoriasHabito: "/api/categorias-habito",
        habitos: "/api/habitos",
        ejercicios: "/api/ejercicios",
        alimentos: "/api/alimentos"
      }
    }
  });
});

// Todas las rutas del CRUD quedan bajo el prefijo /api
app.use("/api", apiRoutes);

// 404 para cualquier ruta no definida
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de errores no controlados (por ejemplo, JSON mal formado en el body)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: "Solicitud inválida. Verifique el formato del JSON enviado." });
});

module.exports = app;