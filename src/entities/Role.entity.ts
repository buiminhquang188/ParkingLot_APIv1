import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryColumn({ length: 30 })
  roleId: string;

  @Column({ unique: true, length: 30 })
  @IsNotEmpty()
  roleName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createBy: number;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;
}
