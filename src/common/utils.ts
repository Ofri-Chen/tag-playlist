import * as config from '../../config';
import * as _ from 'lodash';

export function resolveStringParameters(str: string, params: object): string {
    let startingIndex = 0;
    while (startingIndex < str.length) {
        const relevantPartOfString = str.slice(startingIndex, str.length);

        const start = relevantPartOfString.indexOf(config.stringParameters.start);
        if (start === -1) {
            return str;
        }

        const end = relevantPartOfString.indexOf(config.stringParameters.end);
        if (end === -1) {
            return str;
        }

        const prefix = str.slice(0, startingIndex + start);
        const suffix = str.slice(startingIndex + end + config.stringParameters.end.length, str.length);

        const propName = relevantPartOfString.slice(start + config.stringParameters.start.length, end);

        const defultValue = config.stringParameters.start + propName + config.stringParameters.end;
        const propValue = _.get(params, propName, defultValue);

        str = prefix + propValue + suffix;
        startingIndex += end + config.stringParameters.end.length;
    }

    return str;
}

export function resolveAllStringParametersInObject<T>(obj: object): T {
    return Object.keys(obj).reduce((result, key) => {
        result[key] = resolveStringParameters(obj[key], obj);
        return result;
    }, {}) as T;
}