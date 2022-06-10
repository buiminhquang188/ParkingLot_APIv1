import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class LocationEntity {
  @PrimaryColumn({ length: 20 })
  macAddress: string;

  @Column({ type: 'char', length: 1 })
  blockId: string;

  @Column({ type: 'smallint' })
  slotId: number;

  @Column({ type: 'char', default: 'N' })
  isOccupied: string;

  @Column({ type: 'char', default: 'Y' })
  isUse: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: number;

  @UpdateDateColumn({ nullable: true })
  updateAt: Date;

  @Column({ nullable: true })
  updateBy: number;

  @VersionColumn()
  version: number;
}
