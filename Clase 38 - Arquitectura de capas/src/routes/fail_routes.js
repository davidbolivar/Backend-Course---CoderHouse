import Router from "express";
import fail_controller from "../controllers/failControllers.js";

export const fail_router = new Router();
fail_router.all("*", fail_controller.failRoute);
