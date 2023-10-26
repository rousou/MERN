// This function allows us to pass any type to it and check that this type is not null
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (!val) {
        throw Error("Expected 'val' to be defined, but recieved " + val)
    }
}