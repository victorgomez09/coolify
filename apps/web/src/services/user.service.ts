import { User } from "../models/user.model";
import { send } from "../utils/api.util"

export const getMe = () => {
    return send<unknown, User>({
        path: '/iam',
        method: "GET"
    });
}