// user_sessions.entity.ts
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
@Entity({ name: 'user_sessions' })
export class UserSessions {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  sid: string;

  @Column({ type: 'simple-json', nullable: false })
  sess: JSON;

  @Index('IDX_session_expire')
  @Column({ type: 'timestamp', nullable: false, precision: 6 })
  expire: Date;
}
