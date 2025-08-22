export interface AuthUser {
sub: string; // userId from JWT (subject)
email?: string;
coupleId: string;
}