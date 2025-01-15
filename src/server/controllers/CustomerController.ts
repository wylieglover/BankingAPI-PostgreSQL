import { Request, Response, NextFunction } from "express";
import { CustomerModel } from "../models/CustomerModel";
import { PrismaClient } from "@prisma/client";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../types/customer";
import { successResponse, errorResponse } from "../middleware/authMiddleware";
import { validationResult } from "express-validator";
import { authService } from "../middleware/services/AuthService";

export class CustomerController {
  private customerModel: CustomerModel;

  constructor(prisma: PrismaClient) {
    this.customerModel = new CustomerModel(prisma);
  }

  createCustomerController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customerData: CreateCustomerDTO = req.body;
      const customer = await this.customerModel.createCustomer(customerData);
      customer.password = "";

      const token = authService.signToken({
        customer_id: customer.customer_id,
      });

      successResponse(
        res,
        "Customer created",
        {
          customer: customer,
          token,
        },
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errorResponse(res, "Validation failed", 400);
        return;
      }

      const { username, password } = req.body;

      if (!username || !password) {
        errorResponse(res, "Username and password are required", 400);
        return;
      }

      const customer = await this.customerModel.login(username, password);

      if (!customer) {
        errorResponse(res, "Invalid username or password", 401);
        return;
      }

      const token = authService.signToken({
        customer_id: customer.customer_id,
      });

      successResponse(
        res,
        "Login successful",
        {
          customer: customer,
          token,
        },
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  getCustomerAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const [totalCount, newCustomersThisMonth, customersByMonth] =
        await Promise.all([
          this.customerModel.count(),
          this.customerModel.getNewCustomersCount(
            new Date(new Date().setMonth(new Date().getMonth() - 1)),
          ),
          this.customerModel.getCustomersByMonth(),
        ]);

      successResponse(res, "Customer analytics retrieved", {
        totalCount,
        newCustomersThisMonth,
        customersByMonth,
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerBalanceController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        errorResponse(res, "Customer ID is required", 400);
        return;
      }

      const balance = await this.customerModel.getCustomerBalance(customerId);
      successResponse(res, "Customer balance retrieved", Number(balance), 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerCount = async (
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
      const customersCount = await this.customerModel.count(dateFilter);

      successResponse(res, "Customers count retrieved", {
        count: customersCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllCustomersController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      req.params.pa;
      const { customers, total } = await this.customerModel.getAllCustomers({
        page,
        pageSize,
      });

      const sanitizedCustomers = customers.map((c) => ({
        ...c,
        password: undefined,
      }));

      successResponse(res, "Customers retrieved", {
        data: sanitizedCustomers,
        meta: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        errorResponse(res, "Customer ID is required", 400);
        return;
      }

      const customer = await this.customerModel.getCustomerById(customerId);

      if (!customer) {
        errorResponse(res, "Customer not found", 404);
        return;
      }
      successResponse(res, "Customer retrieved", customer);
    } catch (error) {
      next(error);
    }
  };

  updateCustomerController = async (
    req: Request,
    res: Response,
    next: NextFunction,
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

      const customer =
        await this.customerModel.updateCustomer(updateCustomerData);

      if (!customer) {
        errorResponse(res, "Customer not found", 404);
        return;
      }

      customer.password = "";

      successResponse(res, "Customer updated", customer);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomerController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { customerId } = req.params;

      await this.customerModel.deleteCustomer(customerId);
      successResponse(res, "Customer deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  };
}
