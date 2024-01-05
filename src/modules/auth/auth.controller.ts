import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GoogleAuthGuard } from './guards/GoogleAuthGuard';
import { Response, Request } from 'express';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { Public } from 'src/decorators/public.decorator';
import { JwtAuthGuard } from './guards/AuthGuard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect() {
    return { msg: 'OK' };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({
    type: RegisterUserDto,
    description: 'User registered successfully',
  })
  async register(
    // defines the data sent in the body of the HTTP post request
    @Body() body: RegisterUserDto,
    // {passthrough: true} allows manual handling of the response using res methods
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUser = await this.authService.register(body);
    const accessToken = await this.authService.generateJwt(newUser);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + Number(process.env.JWT_EXPIRY)),
    });
    return newUser;
  }

  // TODO upload avatar image upon register

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    type: LoginUserDto,
    description: 'User logged in successfully',
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithUser,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token = await this.authService.generateJwt(user);
    console.log('access token', access_token);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: new Date(Date.now() + Number(process.env.JWT_EXPIRY)),
    });
    console.log('req.user', req.user);
    return user;
  }

  @Public()
  @Get('test')
  testUser(@Req() req: Request): any {
    console.log(req.user);
    return req.user;
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({ description: 'Token refreshed successfully' })
  async refreshToken(
    @Req() req: RequestWithUser,
  ): Promise<{ accessToken: string }> {
    const refreshToken = await req.cookies['access_token'];
    console.log(refreshToken);
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out a user' })
  @ApiOkResponse({ description: 'User logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user information' })
  @ApiOkResponse({ description: 'User information' })
  async getCurrentUser(@Req() req: Request) {
    const cookie = await req.cookies['access_token'];
    const user = await this.authService.getCurrentUser(cookie);
    return user;
  }
}
