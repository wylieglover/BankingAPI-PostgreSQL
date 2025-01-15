import { PrismaClient, beneficiaries } from "@prisma/client";
import {
  CreateBeneficiaryDTO,
  UpdateBeneficiaryDTO,
  BeneficiaryPaginationParams,
} from "../types/beneficiary";

export class BeneficiariesModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createBeneficiary = async (
    data: CreateBeneficiaryDTO,
  ): Promise<beneficiaries> => {
    try {
      return await this.prisma.beneficiaries.create({
        data: {
          customer_id: data.customerId,
          name: data.name,
          account_number: data.accountNumber,
          bank_details: data.bankDetails,
        },
      });
    } catch (error) {
      console.error("Error creating beneficiary:", error);
      throw error;
    }
  };

  count = async (dateFilter?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<number> => {
    if (!dateFilter) {
      return await this.prisma.beneficiaries.count();
    }

    return await this.prisma.beneficiaries.count({
      where: {
        created_at: {
          gte: dateFilter.startDate,
          lte: dateFilter.endDate,
        },
      },
    });
  };

  getAllBeneficiaries = async (
    params: BeneficiaryPaginationParams,
  ): Promise<beneficiaries[]> => {
    try {
      return await this.prisma.beneficiaries.findMany({
        where: { customer_id: params.customerId },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      throw error;
    }
  };

  getBeneficiaryById = async (
    beneficiaryId: string,
  ): Promise<beneficiaries | null> => {
    try {
      return await this.prisma.beneficiaries.findUnique({
        where: { beneficiary_id: beneficiaryId },
      });
    } catch (error) {
      console.error("Error fetching beneficiary by ID:", error);
      throw error;
    }
  };

  updateBeneficiary = async (
    updatedData: UpdateBeneficiaryDTO,
  ): Promise<beneficiaries> => {
    try {
      return await this.prisma.beneficiaries.update({
        where: { beneficiary_id: updatedData.beneficiaryId },
        data: {
          name: updatedData.name,
          account_number: updatedData.accountNumber,
          bank_details: updatedData.bankDetails,
        },
      });
    } catch (error) {
      console.error("Error updating beneficiary:", error);
      throw error;
    }
  };

  deleteBeneficiary = async (beneficiaryId: string): Promise<beneficiaries> => {
    try {
      return await this.prisma.beneficiaries.delete({
        where: { beneficiary_id: beneficiaryId },
      });
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      throw error;
    }
  };
}
