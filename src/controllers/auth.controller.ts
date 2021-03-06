import { VerifyTokenDto } from './../dtos/users.dto';
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
  @Body({ required: true })
  @ContentType('application/json')
  async signUp(@Body() userData: UserCreateDto): Promise<any> {
    const signUpUserData: User = await this.authService.signUp(userData);

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

  @Post('/verify-token')
  @OpenAPI({
    security: [{ BearerAuth: [] }],
  })
  @Authorized()
  @ContentType('apllication/json')
  async verifyToken(@Body() token: VerifyTokenDto, @CurrentUser() currentUser: User): Promise<any> {
    return await this.authService.verifyToken(token, currentUser)
  }
}

export default AuthController;
