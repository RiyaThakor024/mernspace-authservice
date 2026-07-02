import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { authenticate } from '../middlewares/authenticates';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import userValidator from '../validator/user-validator';
const router = express.Router();

const getUserService = () => new UserService(AppDataSource.getRepository(User));
const getUserController = () => new UserController(getUserService());
router.post(
    '/',
    userValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        getUserController().create(req, res, next),
);
router.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        getUserController().getAll(req, res, next),
);

router.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) => getUserController().userById(req, res),
);

router.put(
    '/:id',
    userValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) => getUserController().updatedUser(req, res),
);

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) => getUserController().deleteUser(req, res),
);
export default router;
