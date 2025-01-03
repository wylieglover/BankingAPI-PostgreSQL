import { Router } from 'express';
import { validate, authenticate, createBeneficiaryRules, updateBeneficiaryRules } from '../middleware/authMiddleware';
import { BeneficiaryController } from '../controllers/BeneficiaryController';
import { prisma } from '../prisma';

const router = Router({ mergeParams: true });
const beneficiaryController = new BeneficiaryController(prisma);

router.use(authenticate);

// Beneficiary routes
router.get('/', beneficiaryController.getAllBeneficiariesController);
router.get('/:beneficiaryId', beneficiaryController.getBeneficiaryByIdController);
router.post('/', validate(createBeneficiaryRules), beneficiaryController.createBeneficiaryController);
router.put('/:beneficiaryId', validate(updateBeneficiaryRules), beneficiaryController.updateBeneficiaryController);
router.delete('/:beneficiaryId', beneficiaryController.deleteBeneficiaryController);

export default router;
