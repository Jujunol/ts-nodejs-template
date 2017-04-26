/**
 * Created by Juju on 25/04/2017.
 */
export function env<T>(key: string, fallback?: T): T {
    return process.env[key] || fallback;
}