import { Request, Response, NextFunction } from 'express';
import { CustomerModel } from '../models/CustomerModel';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
    CreateCustomerDTO,
    UpdateCustomerDTO,
    CustomerPaginationParams,
} from '../types/customer';
import { successResponse, errorResponse } from '../middleware/authMiddleware';

export class CustomerController {
    private customerModel: CustomerModel;

    constructor(prisma: PrismaClient) {
        this.customerModel = new CustomerModel(prisma);
    }

    createCustomerController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const customerData: CreateCustomerDTO = req.body;

            const customer = await this.customerModel.createCustomer(customerData);
            customer.password = '';

            successResponse(res, 'Customer created', customer, 201);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                errorResponse(res, 'Username and password are required', 400);
                return;
            }

            const customer = await this.customerModel.login(username, password);

            if (!customer) {
                errorResponse(res, 'Invalid username or password', 401);
                return;
            }

            successResponse(res, 'Login successful', { customer }, 200);
        } catch (error) {
            next(error);
        }
    };

    getAllCustomersController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

            const customers = await this.customerModel.getAllCustomers({ page, pageSize });

            if (customers.length === 0) {
                errorResponse(res, 'No customers found', 404);
                return;
            }

            const sanitizedCustomers = customers.map((c) => ({
                ...c,
                password: undefined,
            }));

            successResponse(res, 'Customers retrieved', sanitizedCustomers);
        } catch (error) {
            next(error);
        }
    };

    getCustomerByIdController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                errorResponse(res, 'Customer ID is required', 400);
                return;
            }

            const customer = await this.customerModel.getCustomerById(customerId);

            if (!customer) {
                errorResponse(res, 'Customer not found', 404);
                return;
            }
            successResponse(res, 'Customer retrieved', customer);
        } catch (error) {
            next(error);
        }
    };

    updateCustomerController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerId } = req.params;
            const { name, email, homeAddress, password } = req.body;

            const updateCustomerData: UpdateCustomerDTO = {
                customerId,
                name,
                email,
                homeAddress,
                password,
            };

            const customer = await this.customerModel.updateCustomer(updateCustomerData);

            if (!customer) {
                errorResponse(res, 'Customer not found', 404);
                return;
            }

            customer.password = '';

            successResponse(res, 'Customer updated', customer);
        } catch (error) {
            next(error);
        }
    };

    deleteCustomerController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerId } = req.params;

            await this.customerModel.deleteCustomer(customerId);
            res.status(204).send();
        } catch (error) {
            next(error)
        }
    };
}