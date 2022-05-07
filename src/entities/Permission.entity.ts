import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PermissionEntity {
  @PrimaryColumn({ length: 30 })
  permissionId: string;

  @Column({ unique: true, length: 30 })
  @IsNotEmpty()
  permissionName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;

  @Column({ nullable: true, length: 30 })
  type: string;
}
