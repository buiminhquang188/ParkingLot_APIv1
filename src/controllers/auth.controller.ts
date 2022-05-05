import { LoginUserDto, UserCreateDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { Authorized, Body, ContentType, Controller, CurrentUser, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
class AuthController {
  public authService = new AuthService();

  @Post('/signUp')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserCreateDto',
          },
          example: {
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin',
          },
        },
      },
    },
  })
  @ContentType('application/json')
  @Body({ required: true })
  async signUp(@Body() userData: UserCreateDto): Promise<any> {
    const signUpUserData: User = await this.authService.signup(userData);

    return signUpUserData;
  }

  @Post('/login')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginUserDto',
          },
          example: {
            email: 'admin@example.com',
            password: 'admin',
          },
        },
      },
    },
  })
  @ContentType('application/json')
  @Body({ required: true })
  async Login(@Body() userData: LoginUserDto): Promise<{ data: any; message: string }> {
    const tokenData = await this.authService.login(userData);

    return { data: tokenData, message: 'login' };
  }

  @Post('/logout')
  @OpenAPI({
    security: [{ BearerAuth: [] }],
  })
  @Authorized()
  @ContentType('application/json')
  async logOut(@CurrentUser() currentUser: User): Promise<{ message: string }> {
    await this.authService.logout(currentUser);
    return { message: 'logout' };
  }
}

export default AuthController;
