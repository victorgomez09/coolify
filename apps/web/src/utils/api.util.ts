import { api } from "../constants/api.constant"
import { auth } from "../constants/auth.constants"

type Props<T> = {
    endpoint: string
    method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE',
    payload?: T
}

export const send = async <INPUT, OUTPUT>({ endpoint, method, payload }: Props<INPUT>): Promise<OUTPUT> => {
    const response = await fetch(`${api.url}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(auth.token)!}`
        },
        body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type');
    if (contentType) {
        if (contentType?.indexOf('application/json') !== -1) {
            return await response.json();
        } else if (contentType?.indexOf('text/plain') !== -1) {
            return await response.text() as OUTPUT;
        } else {
            return {} as OUTPUT;
        }
    } else {
        return {} as OUTPUT;
    }
}