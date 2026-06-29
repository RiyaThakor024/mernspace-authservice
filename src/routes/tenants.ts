import express, { Request, Response, NextFunction } from 'express';
import { TenantController } from '../controllers/tenanrController';
import { TenantService } from '../services/tenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entities/tenents';
import { logger } from '../config/logger';
import { authenticate } from '../middlewares/authenticates';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import tenantValidator from '../validator/tenant-validator';
import { TenantRequest } from '../types';
const router = express.Router();
const tenantRepositary = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepositary);
const tenantController = new TenantController(tenantService, logger);
router.post(
    '/',
    tenantValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);
router.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getAll(req, res, next),
);
router.get(
    '/self',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) =>
        tenantController.self(req as unknown as TenantRequest, res),
);
router.put(
    '/:id',
    tenantValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) => tenantController.updateTenant(req, res),
);
router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response) => tenantController.deleteTenant(req, res),
);
export default router;
