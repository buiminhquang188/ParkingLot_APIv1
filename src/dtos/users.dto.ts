// import { Pagination } from '@/utils/pagination/pagination.dto';
import { Role } from '@/utils/enums';
import { Pagination } from '@/utils/pagination/pagination.dto';
import { IsAlpha, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  public oldPassword: string;

  @IsString()
  @IsOptional()
  public newPassword: string;

  @IsString()
  @IsOptional()
  public confirmPassword: string;
}
export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  public roleID: Role;
}

export class CreateUserDto {
  @IsString()
  // @Length(8, 30)
  @IsAlpha()
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  public roleID: Role;
}

export class SearchUserDto extends Pagination {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  tel: string;

  @IsString()
  @IsOptional()
  status: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsPhoneNumber('VN')
  tel: string;

  @IsString()
  @IsOptional()
  address: string;
}
