import App from '@/app';
import validateEnv from '@utils/validateEnv';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';

validateEnv();

const app = new App([AuthController, UsersController]);

app.listen();
