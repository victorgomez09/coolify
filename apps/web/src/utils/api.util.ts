import { api } from "../constants/api.constant"
import { auth } from "../constants/auth.constants"

type Props<T> = {
    path: string
    method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE',
    headers?: any,
    data?: any,
}

export const send = async <INPUT, OUTPUT>({ path, method, headers, data }: Props<INPUT>): Promise<OUTPUT> => {
    console.log('path', path)
    const token = localStorage.getItem(auth.token);
    const opts: any = { method, headers: {}, body: null };
    if (data && Object.keys(data).length > 0) {
        const parsedData = data;
        for (const [key, value] of Object.entries(data)) {
            if (value === '') {
                parsedData[key] = null;
            }
        }
        if (parsedData) {
            opts.headers['Content-Type'] = 'application/json';
            opts.body = JSON.stringify(parsedData);
        }
    }

    if (headers) {
        opts.headers = {
            ...opts.headers,
            ...headers
        };
    }

    if (token && !path.startsWith('https://') && !path.startsWith('http://')) {
        opts.headers = {
            ...opts.headers,
            Authorization: `Bearer ${token}`
        };
    }

    if (!path.startsWith('https://') && !path.startsWith('http://')) {
        path = `/api/v1${path}`;
    }

    if (!path.startsWith('https://') && !path.startsWith('http://')) {
        path = `${api.url}${path}`;
    }
    if (method === 'POST' && data && !opts.body) {
        opts.body = data;
    }
    const response = await fetch(`${path}`, opts);

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