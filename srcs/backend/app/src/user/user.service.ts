import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

	constructor
	(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async getAll(): Promise<UserDto[] | undefined> 
	{
		return await this.userRepository.find();
	}

	async findByUsername(pseudo: string) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_pseudo: pseudo}});
	}

	async findById(id: number) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_id: id}});
	}

	async findByMail(mail: string) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_mail: mail}});
	}

	async userExist(user_pseudo: string, user_mail: string): Promise<boolean> 
	{
		if(await this.findByUsername(user_pseudo))
			return(true);
		if(await this.findByMail(user_mail))
			return(true);
		return(false);
	}

	async setTwoFactorAuthenticationSecret(user_id : number, secret: string): Promise<any> 
	{
		return this.userRepository.update(user_id, {
			user_TwoFa_secret: secret
		  });
	}

	async setTwoFactorAuthenticationStatus(userId: number, status: boolean) : Promise<any> 
	{
		return this.userRepository.update(userId, {
			user_TwoFa_on: status
		});
	  }
}
