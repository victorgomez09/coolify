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
        path: `/destinations/${id}`,
        method: "GET"
    });

    return await result;
}

export const getDestinationStatus = async (id: string) => {
    const result = await send({
        path: `/destinations/${id}/status`,
        method: "GET"
    });

    return await result;
}

export const changeDestinationSettings = async ({ id, engine, isCoolifyProxyUsed }: ProxyProps) => {
    const result = await send({
        path: `/destinations/${id}/settings`,
        method: "POST",
        data: {
            isCoolifyProxyUsed,
            engine
        }
    });

    return await result;
};

export const stopDestinationProxy = async ({ id, engine }: ProxyProps) => {
    const result = await send({
        path: `/destinations/${id}/stop`,
        method: "POST",
        data: {
            engine
        }
    });

    return await result;
};

export const startDestinationProxy = async ({ id, engine }: ProxyProps) => {
    const result = await send({
        path: `/destinations/${id}/start`,
        method: "POST",
        data: {
            engine
        }
    });

    return await result;
}

export const forceDestinationProxyRestart = async ({ id, engine, fqdn }: ProxyProps) => {
    const result = await send({
        path: `/destinations/${id}/restart`,
        method: "POST",
        data: {
            engine,
            fqdn
        }
    });

    return await result;
};

export const updateDestination = async ({ id, destination }: ProxyProps) => {
    const result = await send({
        path: `/destinations/${id}`,
        method: "POST",
        data: destination
    });

    console.log('sended to backend', destination)

    return await result;
};

export const deleteDestination = async ({ id }: ProxyProps) => {
    // (`/destinations/${destination.id}`, { id: destination.id });
    const result = await send({
        path: `/destinations/${id}`,
        method: "DELETE",
        data: { id }
    });

    return await result;
};

export const deleteDestinationForce = async ({ id }: ProxyProps) => {
    // (`/destinations/${destination.id}`, { id: destination.id });
    const result = await send({
        path: `/destinations/${id}`,
        method: "DELETE",
        data: { id }
    });

    return await result;
};