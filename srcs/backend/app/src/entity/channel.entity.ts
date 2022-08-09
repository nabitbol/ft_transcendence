import { UserDto } from 'src/dto/user.dto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  channel_id: number

  @Column()
  channel_name: string
  
	@Column()
  channel_users: UserDto[];
  
	@Column()
  channel_admins: UserDto[];
  
	@Column()
  channel_banned_user: UserDto[];
  
	@Column()
  channel_muted_user: UserDto[];

  @Column()
  channel_password: string;
}
