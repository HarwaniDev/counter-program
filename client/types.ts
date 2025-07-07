import * as borsh from "borsh";

export class CounterAccount {
    counter: number

    constructor({count}: {count: number}) {
        this.counter = count;
    }
}

export const schema: borsh.Schema = {
    struct: {
        counter: 'u32'
    }
} 

export const COUNTER_SIZE = borsh.serialize(schema, new CounterAccount({count: 0})).length;
