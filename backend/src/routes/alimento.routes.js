const { Router } = require("express");
const controller = require("../controllers/alimento.controller");

const router = Router();

// Rutas CRUD completas montadas en /api/alimentos
router.get("/", controller.getAll);       // GET    /api/alimentos
router.get("/:id", controller.getById);   // GET    /api/alimentos/:id
router.post("/", controller.create);      // POST   /api/alimentos
router.put("/:id", controller.update);    // PUT    /api/alimentos/:id
router.delete("/:id", controller.remove); // DELETE /api/alimentos/:id

module.exports = router;
