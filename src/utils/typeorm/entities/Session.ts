import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity({ name: 'sessions' })
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresAt: number;

  @Column()
  data: string;
}
