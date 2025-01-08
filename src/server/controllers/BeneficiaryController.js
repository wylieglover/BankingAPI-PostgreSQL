"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiaryController = void 0;
const BeneficiaryModel_1 = require("../models/BeneficiaryModel");
const authMiddleware_1 = require("../middleware/authMiddleware");
class BeneficiaryController {
    constructor(prisma) {
        this.createBeneficiaryController = async (req, res, next) => {
            try {
                const beneficiaryData = req.body;
                if (!beneficiaryData.customerId ||
                    !beneficiaryData.name ||
                    !beneficiaryData.accountNumber ||
                    !beneficiaryData.bankDetails) {
                    (0, authMiddleware_1.errorResponse)(res, 'All fields are required', 400);
                    return;
                }
                const newBeneficiary = await this.beneficiariesModel.createBeneficiary(beneficiaryData);
                (0, authMiddleware_1.successResponse)(res, 'Beneficiary created', newBeneficiary, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllBeneficiariesController = async (req, res, next) => {
            try {
                const customerId = req.params.customerId;
                const page = parseInt(req.query.page, 10) || 1;
                const pageSize = parseInt(req.query.pageSize, 10) || 10;
                const params = { customerId, page, pageSize };
                const beneficiaries = await this.beneficiariesModel.getAllBeneficiaries(params);
                (0, authMiddleware_1.successResponse)(res, 'Beneficiaries retrieved', beneficiaries);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBeneficiariesCount = async (req, res, next) => {
            try {
                const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
                const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
                const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;
                const beneficiariesCount = await this.beneficiariesModel.count(dateFilter);
                (0, authMiddleware_1.successResponse)(res, 'Beneficiaries count retrieved', { count: beneficiariesCount });
            }
            catch (error) {
                next(error);
            }
        };
        this.getBeneficiaryByIdController = async (req, res, next) => {
            try {
                const { beneficiaryId } = req.params;
                const beneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
                if (!beneficiary) {
                    (0, authMiddleware_1.errorResponse)(res, 'Beneficiary not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Beneficiary retrieved', beneficiary);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateBeneficiaryController = async (req, res, next) => {
            try {
                const { beneficiaryId } = req.params;
                const { name, accountNumber, bankDetails } = req.body;
                const existingBeneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
                if (!existingBeneficiary) {
                    (0, authMiddleware_1.errorResponse)(res, 'Beneficiary not found', 404);
                    return;
                }
                if (!Object.keys({ name, accountNumber, bankDetails }).length) {
                    (0, authMiddleware_1.errorResponse)(res, 'No fields provided for update', 400);
                    return;
                }
                const updatedData = {
                    beneficiaryId,
                    name,
                    accountNumber,
                    bankDetails,
                };
                const updatedBeneficiary = await this.beneficiariesModel.updateBeneficiary(updatedData);
                (0, authMiddleware_1.successResponse)(res, 'Beneficiary updated', updatedBeneficiary);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteBeneficiaryController = async (req, res, next) => {
            try {
                const { beneficiaryId } = req.params;
                const beneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
                if (!beneficiary) {
                    res.status(404).json({ error: 'Beneficiary not found.' });
                    return;
                }
                await this.beneficiariesModel.deleteBeneficiary(beneficiaryId);
                (0, authMiddleware_1.successResponse)(res, 'Beneficiary deleted successfully', null, 204);
            }
            catch (error) {
                next(error);
            }
        };
        this.beneficiariesModel = new BeneficiaryModel_1.BeneficiariesModel(prisma);
    }
}
exports.BeneficiaryController = BeneficiaryController;
