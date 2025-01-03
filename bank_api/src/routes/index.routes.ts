import { Router } from 'express';
import customersRoutes from './customers.route';
import accountsRoutes from './accounts.route';
import transactionsRoutes from './transactions.route';
import beneficiariesRoutes from './beneficiaries.route';


const router = Router();

// API routes
router.use('/customers', customersRoutes);
router.use('/accounts', accountsRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/beneficiaries', beneficiariesRoutes);

export default router;