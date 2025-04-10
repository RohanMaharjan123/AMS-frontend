// lib/apiClient.ts
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const ACCESS_TOKEN_COOKIE = "Access";
const REFRESH_TOKEN_COOKIE = "refresh";
const ROLE_COOKIE = "role";
const NAME_COOKIE = "name";
const CSRF_TOKEN_COOKIE = 'csrftoken';

const handleUnauthorized = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.warn("Unauthorized access or token expired. Clearing session and redirecting to login.");

        Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/' });
        Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/' });
        Cookies.remove(ROLE_COOKIE, { path: '/' });
        Cookies.remove(NAME_COOKIE, { path: '/' });
        // Cookies.remove(CSRF_TOKEN_COOKIE, { path: '/' });

        toast.error("Session Expired", {
            description: "Your session has expired or is invalid. Please log in again.",
            duration: 5000,
        });

        window.location.href = '/login';
    }
};

const getErrorDetails = async (response: Response): Promise<string> => {
    let errorDetails = `Request failed with status ${response.status} ${response.statusText}`;
    try {
        const errorData = await response.json();
        errorDetails = errorData?.detail || errorData?.message || errorData?.error || JSON.stringify(errorData);
    } catch (e) {
        console.warn("Could not parse error response body as JSON.", e);
    }
    return errorDetails;
};

type FetchOptions = RequestInit & {};

export const apiClient = async (
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        const errorMsg = "API Base URL (NEXT_PUBLIC_API_BASE_URL) is not configured.";
        console.error(errorMsg + " Check environment variables.");
        toast.error("Configuration Error", { description: "Application is not configured correctly. Please contact support." });
        throw new Error(errorMsg);
    }

    const url = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const csrfToken = Cookies.get(CSRF_TOKEN_COOKIE);
    const method = options.method?.toUpperCase() || 'GET';
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
        headers.set('X-CSRFToken', csrfToken);
    }

    const config: RequestInit = {
        ...options,
        method: method,
        headers,
    };

    let response: Response;
    try {
        response = await fetch(url, config);
    } catch (networkError: any) {
        console.error(`Network error calling ${method} ${url}:`, networkError);
        toast.error("Network Error", { description: `Could not connect to the server. Please check your connection.` });
        throw networkError;
    }

    if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
    }

    return response;
};

export const getJson = async <T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const response = await apiClient(endpoint, { ...options, method: 'GET' });

    if (!response.ok) {
        const errorDetails = await getErrorDetails(response);
        console.error(`GET ${endpoint} failed with status ${response.status}: ${errorDetails}`);
        throw new Error(errorDetails);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        console.warn(`GET ${endpoint} returned ${response.status} (No Content).`);
        return null as T;
    }

    try {
        return await response.json() as T;
    } catch (parseError: any) {
        console.error(`Failed to parse JSON response from GET ${endpoint}:`, parseError);
        throw new Error(`Invalid JSON response received from server.`);
    }
};

export const sendJson = async <T = unknown>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body: unknown,
    options: FetchOptions = {}
): Promise<T | null> => {
    const response = await apiClient(endpoint, {
        ...options,
        method: method,
        body: (typeof body === 'string' || body instanceof FormData) ? body : JSON.stringify(body),
    });

    if (!response.ok) {
        const errorDetails = await getErrorDetails(response);
        console.error(`${method} ${endpoint} failed with status ${response.status}: ${errorDetails}`);
        throw new Error(errorDetails);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    try {
        return await response.json() as T;
    } catch (parseError: any) {
        console.error(`Failed to parse JSON response from ${method} ${endpoint}:`, parseError);
        throw new Error(`Invalid JSON response received from server.`);
    }
};

export const sendFormData = async <T = unknown>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH',
    formData: FormData,
    options: FetchOptions = {}
): Promise<T | null> => {
    const response = await apiClient(endpoint, {
        ...options,
        method: method,
        body: formData,
    });

    if (!response.ok) {
        const errorDetails = await getErrorDetails(response);
        console.error(`${method} ${endpoint} (FormData) failed with status ${response.status}: ${errorDetails}`);
        throw new Error(errorDetails);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    try {
        return await response.json() as T;
    } catch (parseError: any) {
        console.error(`Failed to parse JSON response from ${method} ${endpoint} (FormData):`, parseError);
        throw new Error(`Invalid JSON response received from server.`);
    }
};
