export interface SSH {
    id: string,
    name: string,
    privateKey: {
        iv: string,
        content: string,
    },
    createdAt: Date,
    updatedAt: Date,
    teamId: number
}