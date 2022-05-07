import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserOtherPermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, length: 30 })
  roleId: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  permissionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createBy: number;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;

  @Column({ nullable: true })
  updatedBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: number, isUse: string, roleId?: string, userId?: number, permissionId?: string, createBy?: number) {
    this.id = id;
    this.isUse = isUse;
    this.roleId = roleId;
    this.userId = userId;
    this.permissionId = permissionId;
    this.createBy = createBy;
  }
}
