import { Router } from 'express';
import { prisma } from '../prisma';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate, createCustomerRules, updateCustomerRules, validate } from '../middleware/authMiddleware';
import accountRoutes from './AccountRoute';
import beneficiaryRoutes from './BeneficiaryRoute';

const router = Router();
const customerController = new CustomerController(prisma);

// Public routes
router.post('/signup', validate(createCustomerRules), customerController.createCustomerController); // POST /customers/signup
router.post('/login', customerController.login); // POST /customers/login

// Protected routes
router.use(authenticate);

router.get('/', customerController.getAllCustomersController); // GET /customers
router.get('/:customerId', customerController.getCustomerByIdController); // GET /customers/:customerId
router.post('/', validate(createCustomerRules), customerController.createCustomerController); // POST /customers
router.put('/:customerId', validate(updateCustomerRules), customerController.updateCustomerController); // PUT /customers/:customerId
router.delete('/:customerId', customerController.deleteCustomerController); // DELETE /customers/:customerId

// Nested routes
router.use('/:customerId/accounts', accountRoutes); // /customers/:customerId/accounts
router.use('/:customerId/beneficiaries', beneficiaryRoutes); // /customers/:customerId/beneficiaries

export default router;
