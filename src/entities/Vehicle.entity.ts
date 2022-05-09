import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class VehicleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true })
  licensePlates: string;

  @Column()
  twoDigits: string;

  @Column()
  color: string;

  @Column()
  otherDigits: string;

  @Column()
  block: string;

  @Column()
  slotId: string;

  @Column()
  isIn: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn()
  version: number;

  constructor(twoDigits: string, color: string, otherDigits: string, block: string, slotId: string, isIn: string) {
    this.twoDigits = twoDigits;
    this.color = color;
    this.otherDigits = otherDigits;
    this.block = block;
    this.slotId = slotId;
    this.isIn = isIn;
  }
}
