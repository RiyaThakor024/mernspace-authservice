import { Response } from 'express';
import { TenantService } from '../services/tenantService';
import { CreateTenantRequest } from '../types';
import { NextFunction } from 'express-serve-static-core';
import { Logger } from 'pino';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;

        this.logger.debug({ body: req.body }, 'request for creating a tenant');
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info({ id: tenant.id }, 'Tenant has been created');
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
