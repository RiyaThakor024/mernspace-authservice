import { Request } from 'express';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenents';
export interface UserData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    tenantId?: number;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface IRefreshTokenPayload {
    id: string;
    sub?: string;
    role?: number;
}
export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}
export interface TenantRequest {
    tenant: {
        id: string;
        name: string;
        address: string;
    };
}
export interface CreateUserRequest extends Request {
    body: UserData;
}

export interface UserRequest {
    user: {
        id: string;
        firstname: string;
        lastname: string;
    };
}

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: 'Test Tenant',
        address: 'Test Address',
    });
    return tenant;
};
