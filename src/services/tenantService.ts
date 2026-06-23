import { Repository } from 'typeorm';
import { ITenant } from '../types';
import { Tenant } from '../entities/tenents';

export class TenantService {
    constructor(private tenantRepositary: Repository<Tenant>) {}

    async create(tenantdata: ITenant) {
        return await this.tenantRepositary.save(tenantdata);
    }
}
