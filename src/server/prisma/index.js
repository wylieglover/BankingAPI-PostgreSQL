"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction_type = exports.account_type = exports.prisma = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "account_type", { enumerable: true, get: function () { return client_1.account_type; } });
Object.defineProperty(exports, "transaction_type", { enumerable: true, get: function () { return client_1.transaction_type; } });
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
