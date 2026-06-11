class Menu implements Menu_Interface {
    _id: number;
    _name: string;
    _description: string | null;
    _price: number;

    constructor(id: number, name: string, description: string | null, price: number) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._price = price;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string | null {
        return this._description;
    }

    get price(): number {
        return this._price;
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description: string | null) {
        this._description = description;
    }

    set price(price: number) {
        this._price = price;
    }

    toJson(): Object {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            price: this._price
        };
    }
}

interface Menu_Interface {
    readonly id: number;
    name: string;
    description: string | null;
    price: number;
}

export default Menu;