const { Router } = require("express");

const categoriaHabitoRoutes = require("./categoriaHabito.routes");
const habitoRoutes = require("./habito.routes");
const ejercicioRoutes = require("./ejercicio.routes");
const alimentoRoutes = require("./alimento.routes");

const router = Router();

router.use("/categorias-habito", categoriaHabitoRoutes);
router.use("/habitos", habitoRoutes);
router.use("/ejercicios", ejercicioRoutes);
router.use("/alimentos", alimentoRoutes);

module.exports = router;
