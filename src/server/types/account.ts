import { account_type } from "@prisma/client";

export interface CreateAccountDTO {
  customerId: string;
  type: account_type;
  balance: number;
}

export interface UpdateAccountDTO {
  accountId: string;
  type: account_type;
  balance: number;
}

export interface AccountPaginationParams {
  page: number;
  pageSize: number;
  customerId: string;
}
