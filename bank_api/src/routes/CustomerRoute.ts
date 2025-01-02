import { Router } from 'express';
import { prisma } from '../prisma';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate, customerValidationRules, validate } from '../middleware/auth';
import accountRoutes from './AccountRoute';
import beneficiaryRoutes from './BeneficiaryRoute';

const router = Router();
const customerController = new CustomerController(prisma);

// Public routes
router.post('/signup', validate(customerValidationRules), customerController.createCustomerController); // POST /customers/signup
router.post('/login', customerController.login); // POST /customers/login

// Protected routes
router.use(authenticate);

router.get('/', customerController.getAllCustomersController); // GET /customers
router.get('/:customerId', customerController.getCustomerByIdController); // GET /customers/:customerId
router.post('/', validate(customerValidationRules), customerController.createCustomerController); // POST /customers
router.put('/:customerId', validate(customerValidationRules), customerController.updateCustomerController); // PUT /customers/:customerId
router.delete('/:customerId', customerController.deleteCustomerController); // DELETE /customers/:customerId

// Nested routes
router.use('/:customerId/accounts', accountRoutes); // /customers/:customerId/accounts
router.use('/:customerId/beneficiaries', beneficiaryRoutes); // /customers/:customerId/beneficiaries

export default router;
