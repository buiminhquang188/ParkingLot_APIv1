import { VehicleEntity } from './../entities/Vehicle.entity';
import { UserEntity } from '@/entities/Users.entity';
import { dbConnection } from '@databases';
// import * as pagination from '@/utils/pagination/helper/pagination';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UpdateUserProfileDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Brackets } from 'typeorm';

class UserService {
  private userRepository = dbConnection.getRepository(UserEntity);
  private vehicleRepository = dbConnection.getRepository(VehicleEntity);

  public async findAllUser(searchParam: SearchUserDto): Promise<any> {
    const { username, email, status, tel } = searchParam;

    const users = await this.userRepository
      .createQueryBuilder()
      .withDeleted()
      .where((sub) => {
        if (username) {
          sub.where('username ILIKE :username', { username }).orWhere('username IS NULL');
        }
      })
      .andWhere(
        new Brackets((sub) => {
          if (email) {
            sub.where('email ILIKE :email', { email }).orWhere('email IS NULL');
          }
        }),
      )
      .andWhere(
        new Brackets((sub) => {
          if (tel) {
            sub.where('tel ILIKE :tel', { tel }).orWhere('tel IS NULL');
          }
        }),
      )
      .andWhere(
        new Brackets((sub) => {
          if (status) {
            if (status === 'Y') {
              sub.where('"deletedAt" IS NULL');
            } else if (status === 'N') {
              sub.where('"deletedAt" IS NOT NULL');
            }
          }
        }),
      )
      .paginate();
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

  public async updateProfileUser(currentUser: User, requestBody: UpdateUserProfileDto) {
    const { id } = currentUser;
    const { username, address, tel } = requestBody;

    await this.userRepository.update(id, { username, address, tel });
    const findUser = await this.userRepository.findOne({ where: { id } });

    return findUser;
  }

  public async getUserVehicle(currentUser: User) {
    const { email } = currentUser;
    const userVehicle = await this.vehicleRepository.findOne({ where: { username: email, isIn: 'PARKING' } });
    if (!userVehicle) throw new HttpException(httpStatus.BAD_REQUEST, `Vehicle of user ${currentUser.email} is not in parking lot`);
    return userVehicle;
  }
}

export default UserService;
