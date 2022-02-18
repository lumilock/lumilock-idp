// base.entity.ts
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({
    name: 'create_date_time',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDateTime: Date;

  @UpdateDateColumn({
    name: 'last_changed_date_time',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastChangedDateTime: Date;
}
