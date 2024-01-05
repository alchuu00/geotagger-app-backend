import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserType } from 'src/utils/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // Determines what user data to store in the session upon login
  serializeUser(user: UserType, done: any) {
    done(null, user);
  }

  // Fetches the user data from the session using the user ID
  async deserializeUser(payload: UserType, done: any) {
    const user = await this.authService.findUser(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
