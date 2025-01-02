import { Request, Response, NextFunction } from 'express';
import { CustomerModel } from '../models/CustomerModel';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { CreateCustomerDTO, UpdateCustomerDTO, CustomerPaginationParams } from '../types/customer';

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
            res.status(201).json({ ...customer, password: undefined });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }

            const customer = await this.customerModel.login(username, password);

            if (!customer) {
                res.status(401).json({ error: 'Invalid username or password' });
                return;
            }

            res.status(200).json({ message: 'Login successful', customer });
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
                res.status(404).json({ error: 'No customers found' });
                return;
            }

            res.json(customers.map(customer => ({ ...customer, password: undefined })));
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

            // Validate input (additional safeguard)
            if (!customerId) {
                res.status(400).json({ error: 'Customer ID is required' });
                return;
            }

            const customer = await this.customerModel.getCustomerById(customerId);

            if (!customer) {
                res.status(404).json({ error: 'Customer not found' });
                return;
            }
            res.json({ ...customer, password: undefined });
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
            res.json({ customer, password: undefined });
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