import { Team } from "./team.model"

interface Account {
    id: string,
    email: string,
    teams: Team[]
}

export interface User {
    account: Account,
    accounts: Account[]
}