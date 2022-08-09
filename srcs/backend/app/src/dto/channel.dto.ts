import { UserDto } from 'src/dto/user.dto';

export class ChannelDto {
	channel_id: number;
	channel_name: string;
	channel_users: UserDto[];
	channel_admins: UserDto[];
	channel_banned_user: UserDto[];
	channel_muted_user: UserDto[];
	channel_password: string;
}