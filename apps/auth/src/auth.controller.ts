import { Body, Controller, Post, Res, UseGuards, Get, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { User, UserDocument } from './schema/user.schema'
import { Response, Request } from "express"
import { GetUser } from '../decorator/get-user.decorator'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './guard/local-auth.guard'
import { JwtAuthGuard } from './guard/jwt-auth.guard'
import { ApiBearerAuth, ApiTags, ApiCookieAuth } from '@nestjs/swagger'

@ApiTags( 'auth' )

@Controller( 'auth' )
export class AuthController
{
  constructor ( private readonly authService: AuthService ) { }

  @Post( 'register' )
  async register ( @Body() registerDto: RegisterDto ): Promise<User> 
  {

    return await this.authService.register( registerDto )

  }

  @UseGuards( LocalAuthGuard )
  @Post( 'login' )
  async login ( @Body() loginDto: LoginDto, @GetUser() user: UserDocument, @Res( { passthrough: true } ) res: Response ): Promise<User | any> 
  {
    return await this.authService.login( user, res )
  }

  @UseGuards( JwtAuthGuard )
  @Get( 'protected' )
  async testProtected ( @Req() req: Request ): Promise<User | any> 
  {
    console.log( req.cookies )

    return ( { result: "auheticated successfully" } )

  }
}
