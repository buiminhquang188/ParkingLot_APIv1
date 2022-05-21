import App from '@/app';
import AuthController from './controllers/auth.controller';
import { VehicleController } from './controllers/vehicle.controller';
import { IndexController } from './controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import UsersController from './controllers/users.controller';

validateEnv();

const app = new App([AuthController, UsersController, IndexController, VehicleController]);

app.listen();
