import { Router } from "express";
import customersRoutes from "./customers.route";
import accountsRoutes from "./accounts.route";
import transactionsRoutes from "./transactions.route";
import beneficiariesRoutes from "./beneficiaries.route";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// API routes
router.use("/customers", customersRoutes);
router.use("/accounts", accountsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/beneficiaries", beneficiariesRoutes);

router.post("/auth/refresh-token", AuthController.refreshToken);

export default router;
