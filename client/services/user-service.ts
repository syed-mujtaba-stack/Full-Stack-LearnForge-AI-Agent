import { fetchClient } from "./api";

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserUpdate {
    full_name?: string;
    email?: string;
}

export const userService = {
    getMe: () =>
        fetchClient<User>("/users/me"),

    updateMe: (data: UserUpdate) =>
        fetchClient<User>("/users/me", {
            method: "PUT",
            body: JSON.stringify(data),
        }),
};
