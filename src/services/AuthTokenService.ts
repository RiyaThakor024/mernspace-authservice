import { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/User';
import { TokenService } from './TokenService';
import { Response } from 'express';

export class AuthTokenService {
    constructor(private tokenService: TokenService) {}
    async generateAndSetToken(user: User, res: Response) {
        const payload: JwtPayload = {
            sub: String(user.id),
            role: user.role,
        };
        const accessToken = this.tokenService.generateAccessToken(payload);

        //persist the refresh token
        const newRefreshToken =
            await this.tokenService.persistRefreshToken(user);

        //   await this.tokenService.deleteRefreshToken(Number(req.auth.id))
        const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id),
        });
        res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60, //1h
            httpOnly: true, //very imp
        });
        res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
}
