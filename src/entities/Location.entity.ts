import { Column, CreateDateColumn, Entity, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity()
export class LocationEntity {
  @PrimaryColumn({ length: 20 })
  macAddress: string;

  @Column({ type: 'char', length: 1 })
  blockId: string;

  @Column({ type: 'smallint' })
  slotId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: number;

  @VersionColumn()
  version: number;
}
