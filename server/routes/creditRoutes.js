import express from "express"
import { getPlans, purchasePlan } from "../controllers/creditController.js";
import { protect } from "../middlewires/auth.js";
import { verifyPayment } from "../controllers/creditController.js";



const creditRouter =  express.Router();

creditRouter.get('/plan', getPlans);
creditRouter.post('/purchase',protect, purchasePlan);
creditRouter.post("/verify", protect, verifyPayment);


export default creditRouter;