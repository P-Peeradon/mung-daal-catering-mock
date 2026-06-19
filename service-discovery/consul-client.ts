import Consul from 'consul';
import { ServiceConfig, HealthCheckConfig } from './config';
import type { RegisterOptions } from 'consul/lib/agent/service';

export interface ServiceInstance {
  id: string;
  name: string;
  address: string;
  port: number;
  tags: string[];
  meta: Record<string, string>;
}

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

    // Deregister all services registered by this client
    async deregisterAll(): Promise<void> {
        const promises = Array.from(this.registeredServices).map(id =>
            this.deregisterService(id).catch(err => {
                console.error(`Failed to deregister ${id}: ${err}`);
            })
        );
        await Promise.all(promises);
    }

    // Discover healthy instances of a service
    async discoverService(serviceName: string): Promise<ServiceInstance[]> {
        try {
            const result = await this.consul.health.service({
                service: serviceName,
                passing: true  // Only return healthy instances
            });

            return result.map((entry: any) => ({
                id: entry.Service.ID,
                name: entry.Service.Service,
                address: entry.Service.Address,
                port: entry.Service.Port,
                tags: entry.Service.Tags,
                meta: entry.Service.Meta
            }));

        } catch (error) {
            console.error(`Failed to discover service ${serviceName}: ${error}`);
            throw error;
        }
    }

    // Watch for changes in a service
    watchService(serviceName: string, callback: (instances: ServiceInstance[]) => void): () => void {
        const watch = this.consul.watch({
            method: this.consul.health.service,
            options: {
                service: serviceName,
                passing: 'true'
            }
        });

        watch.on('change', (data: any) => {
            const instances = data.map((entry: any) => ({
                id: entry.Service.ID,
                name: entry.Service.Service,
                address: entry.Service.Address,
                port: entry.Service.Port,
                tags: entry.Service.Tags,
                meta: entry.Service.Meta
            }));
            callback(instances);
        });

        watch.on('error', (err: Error) => {
            console.error(`Watch error for ${serviceName}: ${err}`);
        });
            
        // Return function to stop watching
        return () => watch.end();
    }

    // Get the local agent's status
    async getAgentStatus(): Promise<any> {
        return this.consul.agent.self();
    }
}

export default ConsulClient;