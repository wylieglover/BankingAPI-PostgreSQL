import express, { Application, Request, Response, NextFunction } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { Logger, stream } from './middleware/logger';

dotenv.config();

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
    }

    private initializeRoutes() {
        this.app.use('/api', routes);
        this.app.get('/', (req: Request, res: Response) => {
            res.send('API is running');
        });
    }

    private initializeErrorHandling() {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            Logger.error(`Primary Handler: ${err.message}`);
            res.status(500).json({ error: err.message });
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            Logger.info(`Server is running on http://localhost:${this.port}`);
        });
    }
}

const PORT = parseInt(process.env.PORT || '3002', 10);
const server = new App(PORT);
server.listen();
