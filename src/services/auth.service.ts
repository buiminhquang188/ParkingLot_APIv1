import { SECRET_KEY } from '@config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserCreateDto, LoginUserDto } from '@dtos/users.dto';
import { UserEntity } from '@/entities/Users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { Roles } from '@/utils/enum';
import httpStatus from 'http-status';

class AuthService {
  public users = UserEntity;

  public async signup(userData: UserCreateDto) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request is empty');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(httpStatus.CONFLICT, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await userRepository.save({ ...userData, password: hashedPassword, roleID: Roles.USER });
    return createUserData;
  }

  public async login(userData: LoginUserDto) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request is empty');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ select: ['email', 'password'], where: { email: userData.email } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(httpStatus.CONFLICT, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData };
  }

  public async logout(userData: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, "You're not user");

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, "You're not user");
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
