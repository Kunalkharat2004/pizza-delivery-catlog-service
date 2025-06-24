export interface IToppings {
    _id?: string,
    name: string;
    image: string;
    price: number;
    tenantId: string;
    isPublished?: boolean;
}

export interface ToppingFilters {
    q?: string;
    tenantId?: string;
    isPublished?: boolean;
}

export enum ToppingEvents {
    TOPPING_CREATE = "TOPPING_CREATE",
    TOPPING_UPDATE = "TOPPING_UPDATE",
    TOPPING_DELETE = "TOPPING_DELETE",
}