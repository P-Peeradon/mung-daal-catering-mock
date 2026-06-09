class Ingredient implements Ingredient_Interface {
    private _id: number;
    private _name: string;
    private _quantity: number;
    private _unit: string | null;
    private _category: string;

    constructor(id: number, name: string, quantity: number, unit: string | null, category: string) {
        this._id = id;
        this._name = name;
        this._quantity = quantity;
        this._unit = unit;
        this._category = category;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get unit(): string | null {
        return this._unit;
    }

    set unit(value: string | null) {
        this._unit = value;
    }

    get category(): string {
        return this._category;
    }

    set category(value: string) {
        this._category = value;
    }
}

interface Ingredient_Interface {
    id: number;
    name: string;
    quantity: number;
    unit: string | null;
    category: string;
}

export default Ingredient;