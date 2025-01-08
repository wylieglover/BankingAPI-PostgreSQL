"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const Logger_1 = require("./middleware/utils/Logger");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
if (!process.env.PORT) {
    process.exit(1);
}
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)('combined', { stream: Logger_1.stream }));
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Authorization', 'Content-Type'],
            credentials: true,
        }));
    }
    initializeRoutes() {
        this.app.use('/api', index_routes_1.default);
        this.app.get('/', (req, res) => {
            res.send('API is running');
        });
    }
    initializeErrorHandling() {
        this.app.use((err, req, res, next) => {
            Logger_1.Logger.error(`Primary Handler: ${err.message}`);
            // Development-only error details (remove in production)
            if (process.env.NODE_ENV === 'development') {
                res.status(err.status || 500).json({
                    error: err.message,
                    stack: err.stack
                });
            }
            else {
                // Production: Send generic error message
                res.status(err.status || 500).json({
                    error: 'Internal Server Error'
                });
            }
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            Logger_1.Logger.info(`Server is running on http://localhost:${this.port}`);
        });
    }
}
const PORT = parseInt(process.env.PORT);
const server = new App(PORT);
server.listen();
