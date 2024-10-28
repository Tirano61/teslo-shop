import { Controller, Get, Post, Body, UseGuards, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/loogin-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guard/user-role/user-role.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login( loginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRout(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaaders() rawHeader: string[],
    @Headers() headers: IncomingHttpHeaders
    //@Req() request: Express.Request
  ){
    
    //console.log({user: request.user});
    return {
      ok: true,
      msg: 'Hola mundo private',
      user,
      userEmail,
      rawHeader,
      headers

    }
  }

  //! Hacer un decorador para validar los roles (Practica)
  @Get('private2')
  @SetMetadata('roles', [ 'admin', 'super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRout2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user,
    }
  }


}
