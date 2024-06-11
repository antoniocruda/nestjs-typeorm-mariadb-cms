/**
 * Fills up the object with the data from the dto. This only works if all the keys in the
 * DTO are fields in the object. 
 */
export function fillUpObjectWithDtoValues<T>(obj: T, dto: Record<string, any>): T {
    Object.keys(dto).forEach(key => {
        obj[key] = dto[key];
    });

    return obj;
}