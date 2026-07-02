import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { logger } from '../config/logger';
import registerValidator from '../validator/register-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entities/RefreshToken';
import loginValidator from '../validator/login-validator';
import { CredentialService } from '../services/CredentialService';
import { authenticate } from '../middlewares/authenticates';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import { AuthTokenService } from '../services/AuthTokenService';
import parseRefreshToken from '../middlewares/parseRefreshToken';
const router = express.Router();
const createAuthController = () => {
    const userService = new UserService(AppDataSource.getRepository(User));
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    const tokenService = new TokenService(refreshTokenRepository);
    const credentialService = new CredentialService();
    const authTokenService = new AuthTokenService(tokenService);
    return new AuthController(
        userService,
        logger,
        tokenService,
        credentialService,
        authTokenService,
    );
};
router.post(
    '/register',
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        createAuthController().register(req, res, next),
);
router.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        createAuthController().login(req, res, next),
);
router.get('/self', authenticate, (req: Request, res: Response) =>
    createAuthController().self(req as AuthRequest, res),
);

router.post(
    '/refresh',
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        createAuthController().refresh(req as AuthRequest, res, next),
);

router.post(
    '/logout',
    authenticate,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        createAuthController().logout(req as AuthRequest, res, next),
);

export default router;
