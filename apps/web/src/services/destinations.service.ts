import { Destination } from "../models/destination.model";
import { send } from "../utils/api.util"

type ProxyProps = {
    id: string,
    isCoolifyProxyUsed?: boolean,
    engine?: string,
    fqdn?: string,
    destination?: Destination
}

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

export const changeDestinationSettings = async ({ id, engine, isCoolifyProxyUsed }: ProxyProps) => {
    const result = await send({
        endpoint: `/destinations/${id}/settings`,
        method: "POST",
        payload: {
            isCoolifyProxyUsed,
            engine
        }
    });

    return await result;
};

export const stopDestinationProxy = async ({ id, engine }: ProxyProps) => {
    const result = await send({
        endpoint: `/destinations/${id}/stop`,
        method: "POST",
        payload: {
            engine
        }
    });

    return await result;
};

export const startDestinationProxy = async ({ id, engine }: ProxyProps) => {
    const result = await send({
        endpoint: `/destinations/${id}/start`,
        method: "POST",
        payload: {
            engine
        }
    });

    return await result;
}

export const forceDestinationProxyRestart = async ({ id, engine, fqdn }: ProxyProps) => {
    const result = await send({
        endpoint: `/destinations/${id}/restart`,
        method: "POST",
        payload: {
            engine,
            fqdn
        }
    });

    return await result;
};

export const updateDestination = async ({ id, destination }: ProxyProps) => {
    const result = await send({
        endpoint: `/destinations/${id}`,
        method: "POST",
        payload: destination
    });

    return await result;
}