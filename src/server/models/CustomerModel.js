"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class CustomerModel {
    constructor(prisma) {
        this.login = async (username, password) => {
            try {
                const customer = await this.prisma.customers.findUnique({ where: { username } });
                if (!customer) {
                    throw new Error('Invalid username or password');
                }
                const isPasswordValid = await bcrypt_1.default.compare(password, customer.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid username or password');
                }
                return customer;
            }
            catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        };
        this.getNewCustomersCount = async (since) => {
            return await this.prisma.customers.count({
                where: {
                    created_at: {
                        gte: since
                    }
                }
            });
        };
        this.getCustomerBalance = async (customerId) => {
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
        };
        this.getCustomersByMonth = async () => {
            return await this.prisma.$queryRaw `
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM customers
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month ASC
        `;
        };
        this.count = async (dateFilter) => {
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
        this.createCustomer = async (customerData) => {
            try {
                const hashedPassword = await bcrypt_1.default.hash(customerData.password, 10);
                return await this.prisma.customers.create({
                    data: {
                        name: customerData.name,
                        home_address: customerData.homeAddress,
                        email: customerData.email,
                        username: customerData.username,
                        password: hashedPassword,
                    },
                });
            }
            catch (error) {
                console.error('Error creating customer:', error);
                throw error;
            }
        };
        this.getAllCustomers = async (params) => {
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
            }
            catch (error) {
                console.error('Error fetching customers:', error);
                throw error;
            }
        };
        this.getCustomerById = async (customerId) => {
            try {
                return await this.prisma.customers.findUnique({
                    where: { customer_id: customerId },
                    include: {
                        accounts: true,
                        beneficiaries: true
                    }
                });
            }
            catch (error) {
                console.error('Error fetching customer:', error);
                throw error;
            }
        };
        this.getCustomerByUsername = async (username) => {
            try {
                return await this.prisma.customers.findUnique({
                    where: { username }
                });
            }
            catch (error) {
                console.error('Error fetching customer by username:', error);
                throw error;
            }
        };
        this.updateCustomer = async (updateData) => {
            try {
                let hashedPassword;
                if (updateData.password) {
                    hashedPassword = await bcrypt_1.default.hash(updateData.password, 10);
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
            }
            catch (error) {
                console.error('Error updating customer:', error);
                throw error;
            }
        };
        this.deleteCustomer = async (customerId) => {
            try {
                return await this.prisma.customers.delete({
                    where: { customer_id: customerId }
                });
            }
            catch (error) {
                console.error('Error deleting customer:', error);
                throw error;
            }
        };
        this.validateCustomerPassword = async (storedPassword, inputPassword) => {
            return bcrypt_1.default.compare(inputPassword, storedPassword);
        };
        this.prisma = prisma;
    }
}
exports.CustomerModel = CustomerModel;
