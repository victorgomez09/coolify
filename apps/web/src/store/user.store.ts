import { createStore } from "@esmo/react-utils/store";

import { User } from "../models/user.model";

type UserStore = {
    user: User,
    setUser: (newUser: User) => void
}

export const useUserStore = createStore<UserStore>(({ set }) => ({
    user: {
        account: {
            id: 0,
            email: "",
            teams: []
        },
        accounts: []
    },
    setUser: (newUser) => set(() => ({
        user: newUser
    })),
}));