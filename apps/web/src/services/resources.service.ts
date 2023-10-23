import { send } from "../utils/api.util";
import { Resource } from '../models/resource.model'

export const getResources = async () => {
    const result = await send<unknown, Resource>({
        endpoint: '/resources',
        method: "GET"
    });

    return result;
}