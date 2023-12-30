import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserType } from 'src/utils/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserType, done: any) {
    console.log('serialize user');
    console.log(user);
    done(null, user);
  }

  async deserializeUser(payload: UserType, done: any) {
    console.log('payload', payload.id);
    const user = await this.authService.findUser(payload.id);
    console.log('deserialize user');
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
