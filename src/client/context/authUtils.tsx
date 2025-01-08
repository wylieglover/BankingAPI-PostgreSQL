import dayjs from 'dayjs';

export const decodeTokenPayload = (token: string) => {
    try {
        const base64Payload = token.split('.')[1];
        const decodedPayload = atob(base64Payload);
        return JSON.parse(decodedPayload);
    } catch {
        throw new Error('Failed to decode token payload');
    }
};

export const isTokenExpired = (token: string) => {
    try {
        const { exp } = decodeTokenPayload(token);
        return dayjs.unix(exp).isBefore(dayjs());
    } catch {
        return true;
    }
};