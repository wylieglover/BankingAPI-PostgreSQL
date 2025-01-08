import express, { Application, Request, Response, NextFunction } from 'express';
import routes from './routes/index.routes';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { Logger, stream } from './middleware/utils/Logger';
import cors from 'cors';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

class App {
    public app: Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('combined', { stream }));

        this.app.use(
            cors({
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Authorization', 'Content-Type'],
                credentials: true,
            })
        );
    }

    private initializeRoutes() {
        this.app.use('/api', routes);
        this.app.get('/', (req: Request, res: Response) => {
            res.send('API is running');
        });
    }

    private initializeErrorHandling() {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            Logger.error(`Primary Handler: ${err.message}`);

            // Development-only error details (remove in production)
            if (process.env.NODE_ENV === 'development') {
                res.status(err.status || 500).json({
                    error: err.message,
                    stack: err.stack
                });
            } else {
                // Production: Send generic error message
                res.status(err.status || 500).json({
                    error: 'Internal Server Error'
                });
            }
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            Logger.info(`Server is running on http://localhost:${this.port}`);
        });
    }
}

const PORT = parseInt(process.env.PORT);
const server = new App(PORT);
server.listen();