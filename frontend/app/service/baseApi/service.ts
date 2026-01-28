export abstract class BaseApiService {
    protected readonly endpoint: string;
    constructor(resource: string) {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        this.endpoint = `${apiBase}/api/${resource}`;
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        return response.json();
    }
}