import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtTokenService: JwtService) { }

    async validateUser(username: string, password: string): Promise<any> {

        const user = await this.userService.findOne(username);

        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async loginWithCredentials(user: any) {

        const payload = { username: user.username, sub: user.id } // change to userId from id

        return {
            access_token: this.jwtTokenService.sign(payload)
        };
    }

}
