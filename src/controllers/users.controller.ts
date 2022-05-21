import { UpdateUserProfileDto } from './../dtos/users.dto';
import { PaginationAwareObject } from '@/utils/pagination/helper/pagination';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Roles, User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { Authorized, Body, ContentType, Controller, CurrentUser, Delete, Get, Param, Patch, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
const { cloudinary } = require('../utils/cloudinary');
@Controller()
@OpenAPI({
  security: [{ BearerAuth: [] }],
})
class UsersController {
  private userService = new userService();
  private cloudinary = cloudinary;

  @Get('/users')
  @Authorized()
  @ContentType('application/json')
  public async getUsers(@QueryParams() searchParam: SearchUserDto): Promise<{ data: any; message: string }> {
    const findAllUsersData = await this.userService.findAllUser(searchParam);
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @Authorized()
  @ContentType('application/json')
  public async getUserById(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const findOneUserData: User = await this.userService.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Post('/users/create-user')
  @Authorized()
  @ContentType('application/json')
  public async createUser(@Body() userData: CreateUserDto, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const createUserData: User = await this.userService.createUser(userData, currentUser);
    return { data: createUserData, message: 'created' };
  }

  @Put('/users')
  @Authorized()
  @ContentType('application/json')
  public async updateUser(@Body() userData: UpdateUserDto, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const updateUserData: User = await this.userService.updateUser(userData, currentUser);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @Authorized()
  @ContentType('application/json')
  public async deleteUser(@Param('id') userId: number, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const deleteUserData: User = await this.userService.deleteUser(userId, currentUser);

    return { data: deleteUserData, message: 'deleted' };
  }

  @Post('/users/:id')
  @Authorized()
  @ContentType('application/json')
  public async resetPassword(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const resetPasswordData: User = await this.userService.resetPassword(userId);
    return { data: resetPasswordData, message: 'reset password' };
  }

  @Post('/users/:id/reverse-user')
  @Authorized()
  @ContentType('application/json')
  public async reverseUser(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const reverUserData: User = await this.userService.reverseUser(userId);
    return { data: reverUserData, message: 'reverse user' };
  }

  @Get('/user/profile')
  @Authorized()
  @ContentType('application/json')
  public async userProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Put('/user/profile')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateUserProfileDto',
          },
          example: {
            username: 'username',
            tel: '123456789',
            address: '01 Vo Van Ngan',
          },
        },
      },
    },
  })
  @Authorized()
  @ContentType('application/json')
  public async updateUserProfile(@Body() requestBody: UpdateUserProfileDto, @CurrentUser() currentUser: User): Promise<any> {
    const userProfile = await this.userService.updateProfileUser(currentUser, requestBody);
    return userProfile;
  }

  @Get('/user/vehicle-profile')
  @Authorized()
  @ContentType('application/json')
  public async userVehicleProfile(@CurrentUser() currentUser: User): Promise<any> {
    const userVehicleProfile = await this.userService.getUserVehicle(currentUser);
    return userVehicleProfile;
  }
  // @Get('/usersRole')
  // @Authorized()
  // @ContentType('application/json')
  // async getRoles(): Promise<Roles[]> {
  //   const roleData: Roles[] = await this.userService.getRoles();
  //   return roleData;
  // }
}

export default UsersController;
