import { Request, Response, NextFunction } from 'express';
import { BeneficiariesModel } from '../models/BeneficiaryModel';
import { PrismaClient } from '@prisma/client';
import { CreateBeneficiaryDTO, UpdateBeneficiaryDTO, BeneficiaryPaginationParams } from '../types/beneficiary';

export class BeneficiaryController {
    private beneficiariesModel: BeneficiariesModel;

    constructor(prisma: PrismaClient) {
        this.beneficiariesModel = new BeneficiariesModel(prisma);
    }

    createBeneficiaryController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const beneficiaryData: CreateBeneficiaryDTO = req.body;

            if (!beneficiaryData.customerId || !beneficiaryData.name || !beneficiaryData.accountNumber || !beneficiaryData.bankDetails) {
                res.status(400).json({ error: 'All fields are required' });
                return;
            }

            const newBeneficiary = await this.beneficiariesModel.createBeneficiary(beneficiaryData);
            res.status(201).json(newBeneficiary);
        } catch (error) {
            next(error);
        }
    }

    getAllBeneficiariesController = async (
        req: Request,
        res: Response,
        next: NextFunction
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

            const beneficiaries = await this.beneficiariesModel.getAllBeneficiaries(params);
            res.json(beneficiaries);
        } catch (error) {
            next(error);
        }
    }

    getBeneficiaryByIdController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { beneficiaryId } = req.params;

            const beneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);

            if (!beneficiary) {
                res.status(404).json({ error: 'Beneficiary not found.' });
                return;
            }

            res.json(beneficiary);
        } catch (error) {
            next(error);
        }
    }

    updateBeneficiaryController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { beneficiaryId } = req.params;
            const { name, accountNumber, bankDetails } = req.body;

            const existingBeneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
            if (!existingBeneficiary) {
                res.status(404).json({ error: 'Beneficiary not found.' });
                return;
            }

            if (!Object.keys({ name, accountNumber, bankDetails }).length) {
                res.status(400).json({ error: 'No fields provided for update.' });
                return;
            }

            const updatedData: UpdateBeneficiaryDTO = {
                beneficiaryId,
                name,
                accountNumber,
                bankDetails,
            };

            const updatedBeneficiary = await this.beneficiariesModel.updateBeneficiary(updatedData);
            res.status(200).json(updatedBeneficiary);
        } catch (error) {
            next(error);
        }
    }

    deleteBeneficiaryController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { beneficiaryId } = req.params;

            const beneficiary = await this.beneficiariesModel.getBeneficiaryById(beneficiaryId);
            if (!beneficiary) {
                res.status(404).json({ error: 'Beneficiary not found.' });
                return;
            }

            await this.beneficiariesModel.deleteBeneficiary(beneficiaryId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
