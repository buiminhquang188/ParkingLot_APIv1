import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SysLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, length: 50 })
  device: string;

  @Column({ nullable: true, length: 30 })
  username: string;

  @Column({ nullable: true, length: 46 })
  ip: string;

  @Column({ nullable: true, length: 7 })
  method: string;

  @Column({ nullable: true, length: 50 })
  url: string;

  @Column({ nullable: true, width: 3 })
  status: number;

  @Column({ type: 'double precision', nullable: true })
  totalTime: number;

  @Column({ type: 'double precision', nullable: true })
  responseTime: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(
    device?: string,
    method?: string,
    url?: string,
    status?: number,
    totalTime?: number,
    responseTime?: number,
    username?: string,
    ip?: string,
  ) {
    this.device = device;
    this.method = method;
    this.url = url;
    this.status = status;
    this.totalTime = totalTime;
    this.responseTime = responseTime;
    this.username = username;
    this.ip = ip;
  }
}
