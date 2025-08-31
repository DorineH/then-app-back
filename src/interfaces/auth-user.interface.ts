export interface AuthUser {
// sub: string; // userId from JWT (subject)
userId: string;
email?: string;
coupleId: string;
}