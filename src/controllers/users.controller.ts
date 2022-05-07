import { PaginationAwareObject } from '@/utils/pagination/helper/pagination';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Roles, User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { Authorized, Body, ContentType, Controller, CurrentUser, Delete, Get, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
const { cloudinary } = require('../utils/cloudinary');
@Controller()
@OpenAPI({
  security: [{ BearerAuth: [] }],
})
class UsersController {
  private userService = new userService();
  private cloudinary = cloudinary;

  @Post('/users')
  @Authorized()
  @ContentType('application/json')
  async getUsers(@QueryParams() searchParam: SearchUserDto): Promise<{ data: any; message: string }> {
    const findAllUsersData = await this.userService.findAllUser(searchParam);

    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @Authorized()
  @ContentType('application/json')
  async getUserById(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const findOneUserData: User = await this.userService.findUserById(userId);

    return { data: findOneUserData, message: 'findOne' };
  }

  @Post('/users/create-user')
  @Authorized()
  @ContentType('application/json')
  async createUser(@Body() userData: CreateUserDto, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const createUserData: User = await this.userService.createUser(userData, currentUser);

    return { data: createUserData, message: 'created' };
  }

  @Put('/users')
  @Authorized()
  @ContentType('application/json')
  async updateUser(@Body() userData: UpdateUserDto, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const updateUserData: User = await this.userService.updateUser(userData, currentUser);

    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @Authorized()
  @ContentType('application/json')
  async deleteUser(@Param('id') userId: number, @CurrentUser() currentUser: User): Promise<{ data: User; message: string }> {
    const deleteUserData: User = await this.userService.deleteUser(userId, currentUser);

    return { data: deleteUserData, message: 'deleted' };
  }

  @Post('/users/:id')
  @Authorized()
  @ContentType('application/json')
  async resetPassword(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const resetPasswordData: User = await this.userService.resetPassword(userId);

    return { data: resetPasswordData, message: 'reset password' };
  }

  @Post('/users/ReverseUser/:id')
  @Authorized()
  @ContentType('application/json')
  async reverseUser(@Param('id') userId: number): Promise<{ data: User; message: string }> {
    const reverUserData: User = await this.userService.reverseUser(userId);
    return { data: reverUserData, message: 'reverse user' };
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
