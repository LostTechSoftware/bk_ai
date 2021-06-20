// @collapse
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const sendInfoLog = require("../middlewares/sendInfoLog");
const { NewPartner, GetTime } = require("../controllers/Partner");
const { NewOrder } = require("../controllers/Order");
const { NewUser, GetSugestion } = require("../controllers/User");
const { NewRoute, GetRoute } = require("../controllers/Route");

router.post("/create/order", authMiddleware, sendInfoLog, NewOrder);
router.post("/create/partner", authMiddleware, sendInfoLog, NewPartner);
router.post("/create/user", authMiddleware, sendInfoLog, NewUser);
router.post("/create/route", authMiddleware, sendInfoLog, NewRoute);

router.get("/get/user", authMiddleware, sendInfoLog, GetSugestion);
router.get("/get/partner", authMiddleware, sendInfoLog, GetTime);
router.get("/get/route", authMiddleware, sendInfoLog, GetRoute);

module.exports = (app) => app.use(router);
