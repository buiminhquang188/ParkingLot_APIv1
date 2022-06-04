import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  username: string;

  @Column()
  licensePlates: string;

  @Column()
  twoDigits: string;

  @Column()
  color: string;

  @Column()
  otherDigits: string;

  @Column({ nullable: true })
  cameraId: string;

  @Column({ nullable: true, length: 1, type: 'char' })
  block: string;

  @Column({ nullable: true })
  slotId: number;

  @Column()
  isIn: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn()
  version: number;

  constructor(twoDigits: string, color: string, otherDigits: string, isIn: string, licensePlates: string, username: string) {
    this.twoDigits = twoDigits;
    this.color = color;
    this.otherDigits = otherDigits;
    this.isIn = isIn;
    this.licensePlates = licensePlates;
    this.username = username;
  }
}
