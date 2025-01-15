import express, { Application, Request, Response, NextFunction } from "express";
import routes from "./routes/index.routes";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Logger, stream } from "./middleware/utils/Logger";
import cors from "cors";

dotenv.config();

if (!process.env.PORT || !process.env.CLIENT_PORT || !process.env.SERVER_IP) {
  process.exit(1);
}

class App {
  public app: Application;
  public port: number;
  public client_port: number;
  public server_ip: string;

  constructor(port: number, client_port: number, server_ip: string) {
    this.app = express();
    this.port = port;
    this.client_port = client_port;
    this.server_ip = server_ip;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("combined", { stream }));

    const whitelist = [
      `http://localhost:${this.client_port}`,
      `http://${this.server_ip}:${this.client_port}`,
    ];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || whitelist.includes(origin)) {
            // Allow requests with a matching origin or no origin (e.g., Postman)
            callback(null, true);
          } else {
            // Reject requests from disallowed origins
            callback(
              new Error(
                `CORS Error: Origin '${origin}' is not allowed by the server`,
              ),
            );
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
        allowedHeaders: ["Authorization", "Content-Type"], // Allowed headers
        credentials: true, // Allow credentials (cookies, Authorization header, etc.)
      }),
    );
  }

  private initializeRoutes() {
    this.app.use("/api", routes);
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "API is running" });
    });
  }

  private initializeErrorHandling() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        Logger.error(`Primary Handler: ${err.message}`);
      },
    );
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`Server is running on http://localhost:${this.port}`);
    });
  }
}

const PORT = parseInt(process.env.PORT);
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT);
const SERVER_IP = process.env.SERVER_IP;

const server = new App(PORT, CLIENT_PORT, SERVER_IP);
server.listen();
