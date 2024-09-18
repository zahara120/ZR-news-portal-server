const NewsController = require("../controllers/newsController");
const CategoryController = require("../controllers/categoryController");
const UserController = require("../controllers/userController");
const router = require("express").Router();

router
  .get("/news", NewsController.getNewsPub)
  .get("/users", UserController.getDataPub)
  .get("/users/:email", UserController.getDetailData)
  .get("/categories", CategoryController.getCategory)
  .get("/news/:id", NewsController.detailNews);

module.exports = router;
