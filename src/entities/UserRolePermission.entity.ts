import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MenuPermissionEntity } from './menuPermission.entity';

@Entity('user_menu_permission_entity')
export class UserRolePermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, length: 30 })
  roleId: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  menuPermissionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;

  menuPermission?: MenuPermissionEntity;

  constructor(id: number, isUse: string, roleId?: string, userId?: number, menuPermissionId?: number, createBy?: number, updateBy?: number) {
    this.id = id;
    this.isUse = isUse;
    this.roleId = roleId;
    this.userId = userId;
    this.menuPermissionId = menuPermissionId;
    this.createBy = createBy;
    this.updatedBy = updateBy;
  }
}
