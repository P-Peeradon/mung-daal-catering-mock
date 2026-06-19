import ConsulClient, { ServiceInstance } from './consul-client';

export interface RegistryConfig {
    consulHost: string;
    consulPort: number;
    serviceName: string;
    servicePort: number;
    healthCheckPath: string;
}

class ServiceRegistry {
    private client: ConsulClient;
    private config: RegistryConfig;
    private serviceId: string;
    private instanceCache: Map<string, ServiceInstance[]> = new Map();
    private watchers: Map<string, () => void> = new Map();

    constructor(config: RegistryConfig) {
        this.config = config;
        this.client = new ConsulClient();

        // Generate unique service ID using hostname and port
        const hostname = process.env.HOSTNAME || require('os').hostname();
        this.serviceId = `${config.serviceName}-${hostname}-${config.servicePort}`;
    }

    // Register this service instance
    async register(): Promise<void> {
        const address = this.getServiceAddress();

        await this.client.registerService(
        {
            name: this.config.serviceName,
            id: this.serviceId,
            address: address,
            port: this.config.servicePort,
            tags: ['nodejs', process.env.NODE_ENV || 'development'],
            meta: {
            version: process.env.SERVICE_VERSION || '1.0.0',
            started: new Date().toISOString()
            }
        },
        {
            http: `http://${address}:${this.config.servicePort}${this.config.healthCheckPath}`,
            interval: '10s',
            timeout: '5s',
            deregisterAfter: '1m'
        }
        );

        // Handle graceful shutdown
        this.setupGracefulShutdown();
    }

    // Get service address, handling containerized environments
    private getServiceAddress(): string {
        // In Kubernetes, use the pod IP
        if (process.env.POD_IP) {
        return process.env.POD_IP;
        }

        // In Docker, use the container hostname
        if (process.env.HOSTNAME) {
        return process.env.HOSTNAME;
        }

        // Fallback to localhost for local development
        return '127.0.0.1';
    }

    // Setup handlers for graceful shutdown
    private setupGracefulShutdown(): void {
        const shutdown = async () => {
        console.log('Shutting down, deregistering from Consul...');

        // Stop all watchers
        for (const stop of this.watchers.values()) {
            stop();
        }

        // Deregister service
        await this.client.deregisterAll();

        process.exit(0);
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }

    // Get instances of a service with caching
    async getService(serviceName: string): Promise<ServiceInstance[]> {
        // Check cache first
        const cached = this.instanceCache.get(serviceName);
        if (cached && cached.length > 0) {
        return cached;
        }

        // Fetch from Consul
        const instances = await this.client.discoverService(serviceName);
        this.instanceCache.set(serviceName, instances);

        // Set up watcher if not already watching
        if (!this.watchers.has(serviceName)) {
        const stop = this.client.watchService(serviceName, (updated) => {
            this.instanceCache.set(serviceName, updated);
            console.log(`Updated cache for ${serviceName}: ${updated.length} instances`);
        });
        this.watchers.set(serviceName, stop);
        }

        return instances;
    }

    // Get a single instance using round-robin load balancing
    private roundRobinIndex: Map<string, number> = new Map();

    async getServiceInstance(serviceName: string): Promise<ServiceInstance | null> {
        const instances = await this.getService(serviceName);

        if (instances.length === 0) {
        return null;
        }

        // Round-robin selection
        const currentIndex = this.roundRobinIndex.get(serviceName) || 0;
        const instance = instances[currentIndex % instances.length];
        this.roundRobinIndex.set(serviceName, currentIndex + 1);

        return instance;
    }

    // Build URL for a service
    async getServiceUrl(serviceName: string, path: string = ''): Promise<string | null> {
        const instance = await this.getServiceInstance(serviceName);

        if (!instance) {
        return null;
        }

        return `http://${instance.address}:${instance.port}${path}`;
    }
}

export default ServiceRegistry;