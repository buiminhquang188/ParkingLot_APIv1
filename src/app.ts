// import { pagination } from './utils/pagination';
import { UserEntity } from '@/entities/Users.entity';
import { SECRET_KEY } from '@config';
import { dbConnection } from '@databases';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import json from 'morgan-json';
import 'reflect-metadata';
import { Action, getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { CREDENTIALS, ORIGIN } from './config';
import { HttpException } from './exceptions/HttpException';
import { DataStoredInToken } from './interfaces/auth.interface';
import { pagination } from './utils/pagination';
process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  private userRepository = dbConnection.getRepository(UserEntity);

  constructor(Controllers: Function[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.env !== 'test' && this.connectToDatabase();
    this.initializeSwagger(Controllers);
    this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    this.initializeErrorHandling();
    this.app.set('trust proxy', true);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    dbConnection
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    morgan.token('body', (req, res) => JSON.stringify(req['body']));
    //Format model morgan
    const format = json({
      method: ':method',
      url: ':url',
      status: ':status',
      totalTime: ':total-time',
      responseTime: ':response-time',
      userAgent: ':user-agent',
      reqBody: ':body',
      token: ':req[Authorization]',
      ip: ':remote-addr',
    });
    this.app.use(morgan(format, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(pagination);
    this.app.use(cookieParser());
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
      },
      controllers: controllers,
      defaultErrorHandler: false,
      authorizationChecker: async (action: Action) => {
        try {
          const token = action.request.header('Authorization')?.split('Bearer ')[1] || null;
          const secretKey: string = SECRET_KEY;
          const verificationResponse = jwt.verify(token, secretKey) as DataStoredInToken;
          const userId = verificationResponse.id;

          const findUser: UserEntity = await this.userRepository.findOne({ where: { id: userId } });
          if (findUser) {
            return true;
          }
          throw new HttpException(httpStatus.UNAUTHORIZED, 'User is not permission');
        } catch (error) {
          throw new HttpException(httpStatus.UNAUTHORIZED, error.message);
        }
      },
      currentUserChecker: async (action: Action) => {
        try {
          const token: string = action.request.header('Authorization')?.split('Bearer ')[1] || null;
          const secretKey: string = SECRET_KEY;
          const verificationResponse = jwt.verify(token, secretKey) as DataStoredInToken;
          const userId = verificationResponse.id;

          const findUser: UserEntity = await this.userRepository.findOne({ where: { id: userId } });

          return findUser;
        } catch (error) {
          return null;
        }
      },
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          BearerAuth: {
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Parking Lot',
        title: 'Parking Lot API',
        version: '1.0.0',
      },
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
