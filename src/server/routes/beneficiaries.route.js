"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const BeneficiaryController_1 = require("../controllers/BeneficiaryController");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)({ mergeParams: true });
const beneficiaryController = new BeneficiaryController_1.BeneficiaryController(prisma_1.prisma);
// Beneficiary routes
router.get('/', beneficiaryController.getAllBeneficiariesController);
router.get('/:beneficiaryId', beneficiaryController.getBeneficiaryByIdController);
router.post('/', (0, authMiddleware_1.validate)(authMiddleware_1.createBeneficiaryRules), beneficiaryController.createBeneficiaryController);
router.put('/:beneficiaryId', (0, authMiddleware_1.validate)(authMiddleware_1.updateBeneficiaryRules), beneficiaryController.updateBeneficiaryController);
router.delete('/:beneficiaryId', beneficiaryController.deleteBeneficiaryController);
exports.default = router;
