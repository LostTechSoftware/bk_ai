// @collapse
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const { NewPartner, GetTime } = require("../controllers/Partner");
const { NewUser, GetSugestion } = require("../controllers/User");
const { NewRoute, GetRoute } = require("../controllers/Route");

router.post("/create/partner", authMiddleware, NewPartner);
router.post("/create/user", authMiddleware, NewUser);
router.post("/create/route", authMiddleware, NewRoute);

router.post("/get/user", authMiddleware, GetSugestion);
router.post("/get/partner", authMiddleware, GetTime);
router.post("/get/route", authMiddleware, GetRoute);

module.exports = (app) => app.use(router);
