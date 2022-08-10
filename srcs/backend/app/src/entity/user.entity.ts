

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column()
  user_pseudo: string

  @Column()
  user_password: string

  @Column()
  user_elo: number

  @Column()
  user_rank: number
  
  @Column()
  user_status: number

  @Column()
  user_mail: string

}
