const { Router } = require("express");
const controller = require("../controllers/habito.controller");

const router = Router();

// Rutas CRUD completas montadas en /api/habitos
router.get("/", controller.getAll);       // GET    /api/habitos
router.get("/:id", controller.getById);   // GET    /api/habitos/:id
router.post("/", controller.create);      // POST   /api/habitos
router.put("/:id", controller.update);    // PUT    /api/habitos/:id
router.delete("/:id", controller.remove); // DELETE /api/habitos/:id

module.exports = router;
