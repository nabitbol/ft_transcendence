import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_mail: string;

  @Column()
  user_pseudo: string;

  @Column()
  user_JWT: string;

  @Column()
  user_status: number;
}
