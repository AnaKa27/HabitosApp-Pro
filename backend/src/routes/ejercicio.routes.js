const { Router } = require("express");
const controller = require("../controllers/ejercicio.controller");

const router = Router();

// Rutas CRUD completas montadas en /api/ejercicios
router.get("/", controller.getAll);       // GET    /api/ejercicios
router.get("/:id", controller.getById);   // GET    /api/ejercicios/:id
router.post("/", controller.create);      // POST   /api/ejercicios
router.put("/:id", controller.update);    // PUT    /api/ejercicios/:id
router.delete("/:id", controller.remove); // DELETE /api/ejercicios/:id

module.exports = router;