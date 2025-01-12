import dayjs from 'dayjs';

export interface DecodedToken {
    customer_id: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
}

export const decodeToken = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }
        const base64Payload = parts[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload) as DecodedToken;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const isTokenExpired = (token: string) => {
    try {
        const decoded = decodeToken(token);
        if (!decoded) {
            console.warn('Failed to decode token');
            return true; // Treat invalid tokens as expired
        }

        if (!decoded.exp) {
            console.warn('Token does not have an exp field');
            return true; // Treat tokens without `exp` as expired
        }

        return dayjs.unix(decoded.exp).isBefore(dayjs());
    } catch {
        return true;
    }
};