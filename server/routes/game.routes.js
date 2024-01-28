const { Router } = require("express");

const gameController = require("../controllers/game.controller");

const router = Router();

router.get("/games", gameController.games_get);
router.get("/games/:id", gameController.game_get);
router.get("/games/search/:keyword", gameController.game_search_get);
router.post("/games", gameController.game_post);
router.put("/games/:id", gameController.game_put);
router.delete("/games/:id", gameController.game_delete);

module.exports = router;
