import { send } from "../utils/api.util"

export const getMe = () => {
    return send({
        endpoint: '/iam',
        method: "GET"
    });
}