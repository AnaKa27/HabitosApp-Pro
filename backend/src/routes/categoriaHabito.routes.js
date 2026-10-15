const { Router } = require("express");
const controller = require("../controllers/categoriaHabito.controller");

const router = Router();

// Rutas CRUD completas montadas en /api/categorias-habito
router.get("/", controller.getAll);       // GET    /api/categorias-habito
router.get("/:id", controller.getById);   // GET    /api/categorias-habito/:id
router.post("/", controller.create);      // POST   /api/categorias-habito
router.put("/:id", controller.update);    // PUT    /api/categorias-habito/:id
router.delete("/:id", controller.remove); // DELETE /api/categorias-habito/:id

module.exports = router;
