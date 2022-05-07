import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBehaviorLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 30 })
  @IsNotEmpty()
  username: string;

  @Column({ nullable: true, length: 50 })
  device: string;

  @Column({ nullable: true, length: 46 })
  ipAddress: string;

  @Column({ nullable: true, length: 15 })
  logType: string;

  @Column('text', { nullable: true })
  requestParam: string;

  @Column({ nullable: true, length: 7 })
  requestType: string;

  @Column({ nullable: true, length: 50 })
  requestUrl: string;

  @Column('text', { nullable: true })
  oldData: string;

  @Column('text', { nullable: true })
  newData: string;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  // @Column({ nullable: true })
  // updatedBy: number;

  // @UpdateDateColumn()
  // updatedAt: Date;

  constructor(
    username: string,
    device?: any,
    ipAddress?: string,
    logType?: string,
    requestParam?: string,
    requestType?: string,
    requestUrl?: string,
    oldData?: string,
    newData?: string,
    createdBy?: number,
  ) {
    this.username = username;
    this.device = device;
    this.ipAddress = ipAddress;
    this.logType = logType;
    this.requestParam = requestParam;
    this.requestType = requestType;
    this.requestUrl = requestUrl;
    this.oldData = oldData;
    this.newData = newData;
    this.createdBy = createdBy;
  }
}
