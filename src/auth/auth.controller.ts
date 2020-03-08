import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredDto } from './dto/auth-cred.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredDto: AuthCredDto): Promise<void> {
    return this.authService.signUp(authCredDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredDto: AuthCredDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredDto);
  }
}
