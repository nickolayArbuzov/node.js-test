import {UserViewType} from "../types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewType | null
            userId: string | null
        }
    }
}