import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number

  @Column()
  user_pseudo: string

  @Column()
  user_password: string

  @Column({default: 500})
  user_elo: number

  @Column({default: 0})
  user_rank: number
  
  @Column({default: false})
  user_status: boolean

  @Column()
  user_mail: string

  @Column({default: ''})
  user_TwoFa_secret: string

  @Column({default: false})
  user_TwoFa_on: boolean
}