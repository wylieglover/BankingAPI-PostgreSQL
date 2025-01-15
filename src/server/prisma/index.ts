import { PrismaClient, account_type, transaction_type } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, account_type, transaction_type };
