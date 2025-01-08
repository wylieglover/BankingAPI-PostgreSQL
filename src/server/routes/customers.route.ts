import { Router } from 'express';
import { prisma } from '../prisma';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate, createCustomerRules, updateCustomerRules, validate, loginValidationRules } from '../middleware/authMiddleware';
import accountRoutes from './accounts.route';
import beneficiaryRoutes from './beneficiaries.route';

const router = Router();
const customerController = new CustomerController(prisma);

// Public routes
router.post('/signup', validate(createCustomerRules), customerController.createCustomerController); // POST /customers/signup
router.post('/login', validate(loginValidationRules), customerController.login); // POST /customers/login

// Protected routes
router.get('/', authenticate, customerController.getAllCustomersController); // GET /customers
router.get('/count', customerController.getCustomerCount); // GET /customers/count
router.get('/analytics', authenticate, customerController.getCustomerAnalytics)
router.get('/:customerId/balance', authenticate, customerController.getCustomerBalanceController)
router.get('/:customerId', authenticate, customerController.getCustomerByIdController); // GET /customers/:customerId
router.post('/', authenticate, validate(createCustomerRules), customerController.createCustomerController); // POST /customers
router.put('/:customerId', authenticate, validate(updateCustomerRules), customerController.updateCustomerController); // PUT /customers/:customerId
router.delete('/:customerId', authenticate, customerController.deleteCustomerController); // DELETE /customers/:customerId

// Nested routes
router.use('/:customerId/accounts', accountRoutes); // /customers/:customerId/accounts
router.use('/:customerId/beneficiaries', beneficiaryRoutes); // /customers/:customerId/beneficiaries

export default router;