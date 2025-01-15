import { Request, Response, NextFunction } from "express";
import { BeneficiariesModel } from "../models/BeneficiaryModel";
import { PrismaClient } from "@prisma/client";
import {
  CreateBeneficiaryDTO,
  UpdateBeneficiaryDTO,
  BeneficiaryPaginationParams,
} from "../types/beneficiary";

import { errorResponse, successResponse } from "../middleware/authMiddleware";

export class BeneficiaryController {
  private beneficiariesModel: BeneficiariesModel;

  constructor(prisma: PrismaClient) {
    this.beneficiariesModel = new BeneficiariesModel(prisma);
  }

  createBeneficiaryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const beneficiaryData: CreateBeneficiaryDTO = req.body;

      if (
        !beneficiaryData.customerId ||
        !beneficiaryData.name ||
        !beneficiaryData.accountNumber ||
        !beneficiaryData.bankDetails
      ) {
        errorResponse(res, "All fields are required", 400);
        return;
      }

      const newBeneficiary =
        await this.beneficiariesModel.createBeneficiary(beneficiaryData);
      successResponse(res, "Beneficiary created", newBeneficiary, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllBeneficiariesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customerId = req.params.customerId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

      const params: BeneficiaryPaginationParams = {
        customerId,
        page,
        pageSize,
      };
      const beneficiaries =
        await this.beneficiariesModel.getAllBeneficiaries(params);

      successResponse(res, "Beneficiaries retrieved", beneficiaries);
    } catch (error) {
      next(error);
    }
  };

  getBeneficiariesCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const dateFilter =
        startDate || endDate ? { startDate, endDate } : undefined;
      const beneficiariesCount =
        await this.beneficiariesModel.count(dateFilter);

      successResponse(res, "Beneficiaries count retrieved", {
        count: beneficiariesCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getBeneficiaryByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { beneficiaryId } = req.params;

      const beneficiary =
        await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
      if (!beneficiary) {
        errorResponse(res, "Beneficiary not found", 404);
        return;
      }

      successResponse(res, "Beneficiary retrieved", beneficiary);
    } catch (error) {
      next(error);
    }
  };

  updateBeneficiaryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { beneficiaryId } = req.params;
      const { name, accountNumber, bankDetails } = req.body;

      const existingBeneficiary =
        await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
      if (!existingBeneficiary) {
        errorResponse(res, "Beneficiary not found", 404);
        return;
      }

      if (!Object.keys({ name, accountNumber, bankDetails }).length) {
        errorResponse(res, "No fields provided for update", 400);
        return;
      }

      const updatedData: UpdateBeneficiaryDTO = {
        beneficiaryId,
        name,
        accountNumber,
        bankDetails,
      };

      const updatedBeneficiary =
        await this.beneficiariesModel.updateBeneficiary(updatedData);
      successResponse(res, "Beneficiary updated", updatedBeneficiary);
    } catch (error) {
      next(error);
    }
  };

  deleteBeneficiaryController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { beneficiaryId } = req.params;

      const beneficiary =
        await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
      if (!beneficiary) {
        res.status(404).json({ error: "Beneficiary not found." });
        return;
      }

      await this.beneficiariesModel.deleteBeneficiary(beneficiaryId);
      successResponse(res, "Beneficiary deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  };
}
