export class UserDto {
  user_id: number;
  user_pseudo: string;
  user_password: string;
  user_elo: number;
  user_rank: number;
  user_status: boolean;
  user_mail: string;
  user_2FA_secret: string
  user_2FA_on: boolean
}