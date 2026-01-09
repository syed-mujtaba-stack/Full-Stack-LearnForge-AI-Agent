import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { headers, body, ...rest } = options;

    const isFormData = body instanceof FormData;

    // Get the Firebase ID token if a user is logged in
    let token = null;
    if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken();
    }

    const config: RequestInit = {
        ...rest,
        body,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    const fullUrl = `${API_URL}${endpoint}`;

    try {
        const response = await fetch(fullUrl, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || "An error occurred");
        }

        return response.json();
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`API Fetch Error [${fullUrl}]:`, err.message);
        }
        throw err;
    }
}
