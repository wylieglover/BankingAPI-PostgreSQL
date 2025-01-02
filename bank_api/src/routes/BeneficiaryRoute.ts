import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { BeneficiaryController } from '../controllers/BeneficiaryController';
import { prisma } from '../prisma';

const router = Router({ mergeParams: true });
const beneficiaryController = new BeneficiaryController(prisma);

router.use(authenticate);

// Beneficiary routes
router.post('/', beneficiaryController.createBeneficiaryController);
router.get('/', beneficiaryController.getAllBeneficiariesController);
router.delete('/:beneficiaryId', beneficiaryController.deleteBeneficiaryController);

export default router;
