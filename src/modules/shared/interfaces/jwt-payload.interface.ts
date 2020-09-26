export interface JwtPayload {
    name: string,
    email: string,
    photo: string,
    roles: [string]
}