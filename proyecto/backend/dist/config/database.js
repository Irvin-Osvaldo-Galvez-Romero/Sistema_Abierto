"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = global.prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: 'pretty',
});
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map