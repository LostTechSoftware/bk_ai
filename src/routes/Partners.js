// @collapse
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const sendInfoLog = require("../middlewares/sendInfoLog");
const { NewPartner } = require("../controllers/Partner");
const { NewOrder } = require("../controllers/Order");
const { NewUser } = require("../controllers/User");

router.post("/create/order", authMiddleware, sendInfoLog, NewOrder);
router.post("/create/partner", authMiddleware, sendInfoLog, NewPartner);
router.post("/create/user", authMiddleware, sendInfoLog, NewUser);

module.exports = (app) => app.use(router);
