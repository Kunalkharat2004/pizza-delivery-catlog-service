export const mapToObject = (map: Map<string,any>) => {
    const obj: Record<string, any> = {};
    for (let [key, value] of map) {
        obj[key] = value instanceof Map ? mapToObject(value) : value;
    }
    return obj;
}