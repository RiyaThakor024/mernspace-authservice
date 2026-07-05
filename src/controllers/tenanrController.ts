import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenantService';
import { CreateTenantRequest, ITenant, TenantRequest } from '../types';
import { Logger } from 'pino';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
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
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();
            return res.status(200).json(tenants);
        } catch (error) {
            next(error);
        }
    }
    async self(req: TenantRequest, res: Response) {
        const tenant = await this.tenantService.findById(Number(req.tenant.id));
        if (!tenant) {
            throw createHttpError(404, 'Tenant not found');
        }
        res.status(200).json(tenant);
    }

    async updateTenant(req: Request, res: Response) {
        const tenantId = req.params.id;
        const tenantData = req.body as ITenant;
        const updateTenant = await this.tenantService.update(
            Number(tenantId),
            tenantData,
        );
        this.logger.info({ id: updateTenant.id }, 'Tenant has been updated');
        res.status(200).json(updateTenant);
    }
    async deleteTenant(req: Request, res: Response) {
        const tenantId = Number(req.params.id);
        await this.tenantService.delete(tenantId);
        this.logger.info({ id: tenantId }, 'Tenant has been deleted');
        res.status(204).send();
    }
}
