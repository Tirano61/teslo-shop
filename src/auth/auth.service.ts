import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-usr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/loogin-user.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>  
  ){}

  async create( createUserDto: CreateUserDto ) {
  
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      
      await this.userRepository.save( user );
      delete user.password;
      return user;

    } catch (error) {
      
      this.HandleDBError(error)
    }

  }

  async login(loginUserDto: LoginUserDto){

      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({ 
        where: { email },
        select: { email: true, password: true }   
      });

      if( !user ){
        throw new UnauthorizedException('Credentials are not valids');
      }

      if( !bcrypt.compareSync( password, user.password ) )
        throw new UnauthorizedException('Credentials are not valids(Password)');
      return user;
   
  }

  private HandleDBError(error: any): never{
    if( error.code === '23505'){
      throw new BadRequestException( error.detail );
    }
    console.log(error);

    throw new InternalServerErrorException( 'Please check server logs');
  }


}
