import Consul from 'consul';
import { ServiceConfig, HealthCheckConfig } from './config';
import type { RegisterOptions } from 'consul/lib/agent/service';

class ConsulClient {
    private consul: Consul;
    private registeredServices: Set<string> = new Set();

    constructor() {
        this.consul = new Consul({
            host: process.env.CONSUL_HOST || 'localhost',
            port: parseInt(process.env.CONSUL_PORT || '8500', 10),
            secure: process.env.CONSUL_SECURE === 'true'
        });
    }

    // Register a service with Consul
    async registerService(service: ServiceConfig, healthCheck?: HealthCheckConfig): Promise<void> {
        const registration: RegisterOptions = {
            id: service.id,
            name: service.name,
            address: service.address,
            port: service.port,
            tags: service.tags || [],
            check: {
                name: `Health check for ${service.name}`,
                http: healthCheck?.http,
                interval: healthCheck?.interval,
                timeout: healthCheck?.timeout || '5min',
                deregistercriticalserviceafter: healthCheck?.deregisterAfter || '1m'
            }
        };

        try {
            await this.consul.agent.service.register(registration);
            this.registeredServices.add(service.id);
            console.log(`Service ${service.name} registered with Consul`);
        } catch (error) {
            console.error(`Failed to register service: ${error}`);
            throw error;
        }
    }

    // Deregister a service from Consul
    async deregisterService(serviceId: string): Promise<void> {
        try {
            await this.consul.agent.service.deregister(serviceId);
            this.registeredServices.delete(serviceId);
            console.log(`Service ${serviceId} deregistered from Consul`);
        } catch (error) {
            console.error(`Failed to deregister service: ${error}`);
            throw error;
        }
    }
}

export default ConsulClient;