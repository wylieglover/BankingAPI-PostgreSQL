"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiariesModel = void 0;
class BeneficiariesModel {
    constructor(prisma) {
        this.createBeneficiary = async (data) => {
            try {
                return await this.prisma.beneficiaries.create({
                    data: {
                        customer_id: data.customerId,
                        name: data.name,
                        account_number: data.accountNumber,
                        bank_details: data.bankDetails,
                    },
                });
            }
            catch (error) {
                console.error('Error creating beneficiary:', error);
                throw error;
            }
        };
        this.count = async (dateFilter) => {
            if (!dateFilter) {
                return await this.prisma.beneficiaries.count();
            }
            return await this.prisma.beneficiaries.count({
                where: {
                    created_at: {
                        gte: dateFilter.startDate,
                        lte: dateFilter.endDate,
                    }
                }
            });
        };
        this.getAllBeneficiaries = async (params) => {
            try {
                return await this.prisma.beneficiaries.findMany({
                    where: { customer_id: params.customerId },
                    skip: (params.page - 1) * params.pageSize,
                    take: params.pageSize,
                    orderBy: { name: 'asc' },
                });
            }
            catch (error) {
                console.error('Error fetching beneficiaries:', error);
                throw error;
            }
        };
        this.getBeneficiaryById = async (beneficiaryId) => {
            try {
                return await this.prisma.beneficiaries.findUnique({
                    where: { beneficiary_id: beneficiaryId },
                });
            }
            catch (error) {
                console.error('Error fetching beneficiary by ID:', error);
                throw error;
            }
        };
        this.updateBeneficiary = async (updatedData) => {
            try {
                return await this.prisma.beneficiaries.update({
                    where: { beneficiary_id: updatedData.beneficiaryId },
                    data: {
                        name: updatedData.name,
                        account_number: updatedData.accountNumber,
                        bank_details: updatedData.bankDetails,
                    },
                });
            }
            catch (error) {
                console.error('Error updating beneficiary:', error);
                throw error;
            }
        };
        this.deleteBeneficiary = async (beneficiaryId) => {
            try {
                return await this.prisma.beneficiaries.delete({
                    where: { beneficiary_id: beneficiaryId },
                });
            }
            catch (error) {
                console.error('Error deleting beneficiary:', error);
                throw error;
            }
        };
        this.prisma = prisma;
    }
}
exports.BeneficiariesModel = BeneficiariesModel;
