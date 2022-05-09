import { dbConnection } from '@databases';
import { SECRET_KEY } from '@config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserCreateDto, LoginUserDto } from '@dtos/users.dto';
import { UserEntity } from '@/entities/Users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { Role } from '@/utils/enums';
import httpStatus from 'http-status';

class AuthService {
  private userRepository = dbConnection.getRepository(UserEntity)

  public async signUp(userData: UserCreateDto) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request is empty');

    
    const findUser: User = await this.userRepository.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(httpStatus.CONFLICT, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.userRepository.save({ ...userData, password: hashedPassword, roleID: Role.USER });
    return createUserData;
  }

  public async login(userData: LoginUserDto) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, 'Request is empty');

    const findUser: User = await this.userRepository.findOne({ select: ['email', 'password'], where: { email: userData.email } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(httpStatus.CONFLICT, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData };
  }

  public async logout(userData: User) {
    if (isEmpty(userData)) throw new HttpException(httpStatus.BAD_REQUEST, "You're not user");

    const findUser: User = await this.userRepository.findOne({ where: { email: userData.email } });
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
