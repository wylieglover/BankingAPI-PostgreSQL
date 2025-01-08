import bcrypt from 'bcrypt';
import { PrismaClient, customers } from '@prisma/client';
import { CreateCustomerDTO, UpdateCustomerDTO, CustomerPaginationParams } from '../types/customer';
import { Decimal } from '@prisma/client/runtime/library';

export class CustomerModel {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    login = async (
        username: string, password: string
    ): Promise<customers | null> => {
        try {
            const customer = await this.prisma.customers.findUnique({ where: { username } });

            if (!customer) {
                throw new Error('Invalid username or password');
            }

            const isPasswordValid = await bcrypt.compare(password, customer.password);
            if (!isPasswordValid) {
                throw new Error('Invalid username or password');
            }

            return customer;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    getNewCustomersCount = async (since: Date): Promise<number> => {
        return await this.prisma.customers.count({
            where: {
                created_at: {
                    gte: since
                }
            }
        });
    };

    getCustomerBalance = async (customerId: string): Promise<number> => {
        // Verify that the customer exists
        const customerExists = await this.prisma.customers.findUnique({
            where: { customer_id: customerId },
            select: { customer_id: true },
        });

        if (!customerExists) {
            throw new Error('Customer not found');
        }

        // Fetch all account balances
        const accounts = await this.prisma.accounts.findMany({
            where: { customer_id: customerId },
            select: { balance: true },
        });

        // Sum the balances by converting Decimal to number
        const totalBalance = accounts.reduce((sum, account) => {
            // Convert Decimal to number
            const accountBalance = account.balance.toNumber();
            return sum + accountBalance;
        }, 0);

        return totalBalance;
    }

    getCustomersByMonth = async () => {
        return await this.prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM customers
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month ASC
        `;
    };

    count = async (dateFilter?: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<number> => {
        if (!dateFilter) {
            return await this.prisma.customers.count();
        }

        return await this.prisma.customers.count({
            where: {
                created_at: {
                    gte: dateFilter.startDate,
                    lte: dateFilter.endDate,
                }
            }
        });
    };

    createCustomer = async (
        customerData: CreateCustomerDTO
    ): Promise<customers> => {
        try {
            const hashedPassword = await bcrypt.hash(customerData.password, 10);

            return await this.prisma.customers.create({
                data: {
                    name: customerData.name,
                    home_address: customerData.homeAddress,
                    email: customerData.email,
                    username: customerData.username,
                    password: hashedPassword,
                },
            });
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    getAllCustomers = async (
        params: CustomerPaginationParams
    ): Promise<{ customers: customers[]; total: number }> => {
        try {
            // Let's check what we're getting from Prisma
            const customers = await this.prisma.customers.findMany({
                include: {
                    accounts: true,
                    beneficiaries: true,
                },
                skip: (params.page - 1) * params.pageSize,
                take: params.pageSize,
                orderBy: { name: 'asc' },
            });

            const total = await this.prisma.customers.count();

            return { customers, total };
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    getCustomerById = async (
        customerId: string
    ): Promise<customers | null> => {
        try {
            return await this.prisma.customers.findUnique({
                where: { customer_id: customerId },
                include: {
                    accounts: true,
                    beneficiaries: true
                }
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    }

    getCustomerByUsername = async (
        username: string
    ): Promise<customers | null> => {
        try {
            return await this.prisma.customers.findUnique({
                where: { username }
            });
        } catch (error) {
            console.error('Error fetching customer by username:', error);
            throw error;
        }
    }

    updateCustomer = async (
        updateData: UpdateCustomerDTO
    ): Promise<customers> => {
        try {
            let hashedPassword;
            if (updateData.password) {
                hashedPassword = await bcrypt.hash(updateData.password, 10);
            }
            return await this.prisma.customers.update({
                where: { customer_id: updateData.customerId },
                data: {
                    name: updateData.name,
                    email: updateData.email,
                    home_address: updateData.homeAddress,
                    password: hashedPassword
                }
            });
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    }

    deleteCustomer = async (
        customerId: string
    ): Promise<customers> => {
        try {
            return await this.prisma.customers.delete({
                where: { customer_id: customerId }
            });
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    }

    validateCustomerPassword = async (
        storedPassword: string, inputPassword: string
    ): Promise<boolean> => {
        return bcrypt.compare(inputPassword, storedPassword);
    }
}