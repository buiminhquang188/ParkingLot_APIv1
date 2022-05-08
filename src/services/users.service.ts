import { dbConnection } from '@databases';
import { UserEntity } from '@/entities/Users.entity';
// import * as pagination from '@/utils/pagination/helper/pagination';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Brackets } from 'typeorm';

class UserService {
  private userRepository = dbConnection.getRepository(UserEntity);

  public async findAllUser(searchParam: SearchUserDto): Promise<any> {
    const { username, email, status, tel } = searchParam;
    const users = await this.userRepository
      .createQueryBuilder()
      .where((sub) => {
        if (username) {
          sub.where('username ILIKE :username', { username });
        } else {
          sub.select('username');
        }
      })
      .andWhere(
        new Brackets((sub) => {
          if (email) {
            sub.where('email ILIKE :email', { email });
          }
        }),
      )
      .andWhere(
        new Brackets((sub) => {
          if (tel) {
            sub.where('tel ILIKE :tel', { tel });
          } else {
            sub.where('tel IL');
          }
        }),
      )
      .getMany();
    return users;
  }

  public async findUserById(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');

    const findUser: User = await this.userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    return findUser;
  }

  public async createUser(userData: CreateUserDto, currentUser: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request must not empty');



    const hashedPassword = await bcrypt.hash('newuser', 10);
    const createUserData: User = await this.userRepository.save({ ...userData, password: hashedPassword, createdBy: currentUser.id });
    return createUserData;
  }

  public async updateUser(userData: UpdateUserDto, currentUser: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request must not empty');


    const findUser: User = await this.userRepository.findOne({ where: { id: userData.id } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    await this.userRepository.update(userData.id, { ...userData, updatedBy: currentUser.id });

    const updateUser: User = await this.userRepository.findOne({ where: { id: userData.id } });
    return updateUser;
  }

  public async deleteUser(userId: number, currentUser: User) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');


    const findUser: User = await this.userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    await this.userRepository.update(userId, { updatedBy: currentUser.id });
    await this.userRepository.softDelete({ id: userId });

    const deletedUser: User = await this.userRepository.findOne({ where: { id: userId } });

    return deletedUser;
  }

  public async resetPassword(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');


    const findUser: User = await this.userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    const hashedPassword = await bcrypt.hash('newuser', 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    const updateUser: User = await this.userRepository.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async reverseUser(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');


    const reverseUserData: { deletedAt: Date } = await this.userRepository.findOne({ where: { id: userId }, withDeleted: true });

    if (!reverseUserData) throw new HttpException(httpStatus.CONFLICT, 'User not found');
    if (reverseUserData.deletedAt === null) throw new HttpException(httpStatus.CONFLICT, 'User has been deleted');

    await this.userRepository.update(userId, { deletedAt: null });
    const findUserData: User = await this.userRepository.findOne({ where: { id: userId } });

    return findUserData;
  }

  // public async getRoles() {
  //   const roleRepository = getRepository(this.roles);
  //   const rolesData: Roles[] = await roleRepository.find({ select: ['role', 'nameRole'] });
  //   return rolesData;
  // }
}

export default UserService;
