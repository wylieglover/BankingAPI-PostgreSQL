import { transaction_type } from "@prisma/client";

export interface CreateTransactionDTO {
  type: transaction_type;
  amount: number;
  accountId: string;
}

export interface UpdateTransactionDTO {
  transactionId: number;
  type: transaction_type;
  amount: number;
}

export interface TransactionPaginationParams {
  page: number;
  pageSize: number;
  accountId: string;
}
