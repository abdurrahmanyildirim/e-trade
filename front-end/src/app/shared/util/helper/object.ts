import { isPresent } from '../common';

export type ObjectMap = { [key: string]: any };

export class ObjectHelper {

    public static removeReferances(context: any): void {
        for (const key in context) {
            if (context.hasOwnProperty(key)) {
                context[key] = null;
                delete context[key];
            }
        }
    }

    public static copyFields(source: any, dest: any): void {
        if (!isPresent(source)
            || !isPresent(dest)
            || typeof source !== typeof dest) {
            return;
        }
        const keys = Object.keys(source);
        for (const key of keys) {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        }
    }

    public static copyMissingFields(source: object, target: object): object {
        for (const property in source) {
            if (source.hasOwnProperty(property)
                && isPresent(source[property])) {
                if (!isPresent(target[property])) {
                    target[property] = source[property];
                }
            }
        }
        return target;
    }
}
