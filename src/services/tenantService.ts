import { Repository } from 'typeorm';
import { ITenant } from '../types';
import { Tenant } from '../entities/tenents';
import createHttpError from 'http-errors';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantdata: ITenant) {
        return await this.tenantRepository.save(tenantdata);
    }
    async getAll() {
        return await this.tenantRepository.find();
    }
    async findById(id: number) {
        return await this.tenantRepository.findOne({
            where: {
                id,
            },
        });
    }
    async update(id: number, data: ITenant) {
        const tenant = await this.tenantRepository.findOne({
            where: {
                id,
            },
        });
        if (!tenant) {
            throw createHttpError(404, 'tenant not found');
        }
        tenant.name = data.name;
        tenant.address = data.address;

        const updateTenant = await this.tenantRepository.save(tenant);
        return updateTenant;
    }
    async delete(id: number) {
        const tenant = await this.tenantRepository.findOne({
            where: {
                id,
            },
        });
        if (!tenant) {
            throw createHttpError(404, 'tenant not found');
        }

        await this.tenantRepository.remove(tenant);
    }
}
