import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MenuEntity {
  @PrimaryColumn({ length: 50 })
  menuCode: string;

  @Column({ unique: true, length: 50 })
  @IsNotEmpty()
  menuName: string;

  @Column({ nullable: true, length: 50 })
  parentCode: string;

  @Column({ nullable: true, length: 255 })
  route: string;

  @Column({ nullable: true, length: 50 })
  heading: string;

  @Column({ nullable: true, length: 50 })
  svgIcon: string;

  @Column({ nullable: true, length: 50 })
  fontIcon: string;

  @Column({ nullable: true, type: 'int' })
  level: number;

  @Column({ nullable: true, type: 'int' })
  sort: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createBy: number;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;
}
