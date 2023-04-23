export class MockConfigService<Type = string> {
    public data: Record<string, Type>;

    constructor(data: Record<string, Type>) {
        this.data = data;
    }

    get(key: string): Type[keyof Type] {
        const value = this.data[key];
        if (value === undefined) {
            throw new Error(`Config key "${key}" is undefined`);
        }
        return value as Type[keyof Type];
    }
}
