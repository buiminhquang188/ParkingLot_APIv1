import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  twoDigits: string;

  @Column()
  color: string;

  @Column()
  otherDigits: string;

  @Column()
  cameraId: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn()
  version: number;
}
