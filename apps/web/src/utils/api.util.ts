import { api } from "../constants/api.constant"
import { auth } from "../constants/auth.constants"

type Props<T> = {
    endpoint: string
    method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE',
    payload?: T
}

export const send = async <INPUT, OUTPUT>({ endpoint, method, payload }: Props<INPUT>): Promise<OUTPUT> => {
    const result = await fetch(`${api.url}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(auth.token)!}`
        },
        body: JSON.stringify(payload)
    });

    return await result.json() as Promise<OUTPUT>;
}