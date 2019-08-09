import { resolveStringParameters, resolveAllStringParametersInObject } from "./common/utils";

const obj = {
    aa: 'aa--{{arg1}}--{{arg2}}--{{arg3}}',
    arg1: "@@arg1@@",
    arg3: "@@arg3@@",
}


console.log(JSON.stringify(resolveAllStringParametersInObject(obj), null, 2));