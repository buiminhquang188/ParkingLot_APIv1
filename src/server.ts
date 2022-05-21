import { VehicleController } from './controllers/vehicle.controller';
import { IndexController } from './controllers/index.controller';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';

validateEnv();

const app = new App([AuthController, UsersController, IndexController, VehicleController]);

app.listen();
