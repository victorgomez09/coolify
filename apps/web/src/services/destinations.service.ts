import { send } from "../utils/api.util"

export const getDestination = async (id: string) => {
    const result = await send({
        endpoint: `/destinations/${id}`,
        method: "GET"
    });

    return await result;
}

export const getDestinationStatus = async (id: string) => {
    const result = await send({
        endpoint: `/destinations/${id}/status`,
        method: "GET"
    });

    return await result;
}