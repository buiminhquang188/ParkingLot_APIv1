import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuPermissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  permissionId: string;

  @Column({ nullable: true, length: 50 })
  menuCode: string;

  @Column({ length: 50, unique: true })
  @IsNotEmpty()
  apiName: string;

  @CreateDateColumn()
  createdAt: Date;
}
