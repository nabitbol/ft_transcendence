import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.POSTGRES_ENV_PORT,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
