import { expressjwt, GetVerificationKey } from 'express-jwt';
import { Request } from 'express';
import jwksRsa from 'jwks-rsa';
import { Config } from '../config';

export const authenticate = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        jwksUri: Config.JWKS_URI,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        console.log('cookies =>', req.cookies);
        console.log('cookies =>', req.headers.authorization);

        const authHeader = req.headers.authorization;
        //Bearer fhyjjggdffhyjyhbghtyttdaeddfada
        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }
        type AuthCookie = {
            accessToken: string;
        };

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
