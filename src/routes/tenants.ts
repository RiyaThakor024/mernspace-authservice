import express from 'express';
import { TenantController } from '../controllers/tenanrController';
import { TenantService } from '../services/tenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entities/tenents';
import { logger } from '../config/logger';
import { authenticate } from '../middlewares/authenticates';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
const router = express.Router();
const tenantRepositary = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepositary);
const tenantController = new TenantController(tenantService, logger);
router.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    tenantController.create(req, res, next),
);
export default router;
