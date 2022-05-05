import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { UpdateUserDto, CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { Roles, User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import httpStatus from 'http-status';
import RoleEntity from '@entities/roles.entity';

class UserService {
  private users = UserEntity;
  private roles = RoleEntity;

  public async findAllUser(): Promise<User[]> {
    const userRepository = getRepository(this.users);
    const users: User[] = await userRepository.find();
    return users;
  }

  public async findUserById(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    return findUser;
  }

  public async createUser(userData: CreateUserDto, currentUser: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request must not empty');

    const userRepository = getRepository(this.users);

    const hashedPassword = await bcrypt.hash('newuser', 10);
    const createUserData: User = await userRepository.save({ ...userData, password: hashedPassword, createdBy: currentUser.id });
    return createUserData;
  }

  public async updateUser(userData: UpdateUserDto, currentUser: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request must not empty');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userData.id } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    await userRepository.update(userData.id, { ...userData, updatedBy: currentUser.id });

    const updateUser: User = await userRepository.findOne({ where: { id: userData.id } });
    return updateUser;
  }

  public async deleteUser(userId: number, currentUser: User) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    await userRepository.update(userId, { updatedBy: currentUser.id });
    await userRepository.softDelete({ id: userId });

    const deletedUser: User = await userRepository.findOne({ where: { id: userId } });

    return deletedUser;
  }

  public async resetPassword(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, 'User not found or has been deleted');

    const hashedPassword = await bcrypt.hash('newuser', 10);
    await userRepository.update(userId, { password: hashedPassword });

    const updateUser: User = await userRepository.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async reverseUser(userId: number) {
    if (isEmpty(userId)) throw new HttpException(httpStatus.BAD_REQUEST, 'ID must not empty');

    const userRepository = getRepository(this.users);
    const reverseUserData: { deletedAt: Date } = await userRepository.findOne({ where: { id: userId }, withDeleted: true });

    if (!reverseUserData) throw new HttpException(httpStatus.CONFLICT, 'User not found');
    if (reverseUserData.deletedAt === null) throw new HttpException(httpStatus.CONFLICT, 'User has been deleted');

    await userRepository.update(userId, { deletedAt: null });
    const findUserData: User = await userRepository.findOne({ where: { id: userId } });

    return findUserData;
  }

  public async getRoles() {
    const roleRepository = getRepository(this.roles);
    const rolesData: Roles[] = await roleRepository.find({ select: ['role', 'nameRole'] });
    return rolesData;
  }
}

export default UserService;
