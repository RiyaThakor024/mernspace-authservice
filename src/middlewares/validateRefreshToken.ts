import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entities/RefreshToken';
import { IRefreshTokenPayload } from '../types';
import { logger } from '../config/logger';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return refreshToken;
    },
    async isRevoked(request: Request, token) {
        //  console.log("VALIDATE REFRESH TOKEN");
        //  console.log(token?.payload);

        const payload = token?.payload as IRefreshTokenPayload | undefined;
        if (!payload?.id || !payload?.sub) {
            return true;
        }

        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number(payload.id),
                    userId: Number(payload.sub),
                },
            });
            return refreshToken === null;
        } catch (error) {
            logger.error(
                `error while getting refresh token: ${payload.id} - ${String(
                    error,
                )}`,
            );
            return true;
        }
    },
});
