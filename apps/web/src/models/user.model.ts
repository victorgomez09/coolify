import { Team } from "./team.model"

interface Account {
    id: number,
    email: string,
    teams: Team[]
}

export interface User {
    account: Account,
    accounts: Account[]
}