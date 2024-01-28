const { Router } = require("express");

const playscoreController = require("../controllers/playscore.controller");

const router = Router();

router.get("/users/:userId/playscores", playscoreController.playscores_for_user_get);
router.get("/games/:gameId/playscores", playscoreController.playscores_for_game_get);
router.post("/playscores", playscoreController.playscore_post);
router.put("/playscores/:id", playscoreController.playscore_put);
router.delete("/playscores/:id", playscoreController.playscore_delete);

module.exports = router;
