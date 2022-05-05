import { Column, CreateDateColumn, Entity, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  role: string;

  @Column({ type: 'varchar', length: 10 })
  nameRole: string;

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn({ type: 'smallint' })
  version: number;
}

export default RoleEntity;
