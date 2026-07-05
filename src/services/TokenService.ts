import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Config } from '../config';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { Repository } from 'typeorm';
// import fs from 'fs';
// import { log } from 'console';

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        if (!Config.PRIVATE_KEY) {
            const err = createHttpError(500, 'PRIVATE_KEY is not set');
            throw err;
        }
        let privateKey: string;
        try {
            // privateKey = fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
            privateKey = Config.PRIVATE_KEY;
        } catch {
            const err = createHttpError(500, 'Error while reading private key');
            throw err;
        }
        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });
        return accessToken;
    }
    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });
        return refreshToken;
    }
    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            userId: user.id,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken;
    }

    //delete older refresh token
    async deleteRefreshToken(tokenId: number) {
        return await this.refreshTokenRepository.delete({ id: tokenId });
    }
}
