import { Router } from 'express';
import customersRoutes from './CustomerRoute';
import accountsRoutes from './AccountRoute';
import transactionsRoutes from './TransactionRoute';
import beneficiariesRoutes from './BeneficiaryRoute';


const router = Router();

// API routes
router.use('/customers', customersRoutes);
router.use('/accounts', accountsRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/beneficiaries', beneficiariesRoutes);

export default router;
