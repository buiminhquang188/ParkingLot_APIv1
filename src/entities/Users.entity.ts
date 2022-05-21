import { Role } from '@/utils/enums';
import { User } from '@interfaces/users.interface';
import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 30 })
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @Column({
    default: Role.USER,
    length: 15,
  })
  roleId: string;

  @Column({ nullable: true })
  lastPasswordChange: Date;

  @Column({ nullable: true, length: 15 })
  tel: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  connectDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
