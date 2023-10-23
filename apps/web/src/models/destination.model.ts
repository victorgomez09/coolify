import { Team } from "./team.model";

export interface Destination {
    id: string,
    network: string,
    name: string,
    engine: string,
    remoteEngine: boolean,
    remoteIpAddress: string,
    remoteUser: string,
    remotePort: number,
    remoteVerified: boolean,
    isCoolifyProxyUsed: boolean,
    createdAt: Date,
    updatedAt: Date,
    sshKeyId: string,
    sshLocalPort: number,
    teams: Team[]
}