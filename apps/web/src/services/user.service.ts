import { User } from "../models/user.model";
import { send } from "../utils/api.util"

export const getMe = () => {
    return send<unknown, User>({
        endpoint: '/iam',
        method: "GET"
    });
}