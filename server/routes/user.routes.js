const { Router } = require("express");

const userController = require("../controllers/user.controller");

const router = Router();

router.get("/users", userController.users_get);
router.get("/users/:id", userController.user_get);
router.get("/users/search/:keyword", userController.user_search_get);
router.post("/users", userController.user_post);
router.put("/users/:id", userController.user_put);
router.delete("/users/:id", userController.user_delete);

module.exports = router;
