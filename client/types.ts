import * as borsh from "borsh";

export class CounterAccount {
    counter: number

    constructor({ count }: { count: number }) {
        this.counter = count;
    }
}

export const schema: borsh.Schema = {
    struct: {
        counter: 'u32'
    }
}

export const COUNTER_SIZE = borsh.serialize(schema, new CounterAccount({ count: 0 })).length;


export enum CounterInstructionType {
  Increment = 0,
  Decrement = 1,
}

export class IncrementInstruction {
  value: number;
  constructor({ value }: { value: number }) {
    this.value = value;
  }
}

export class DecrementInstruction {
  value: number;
  constructor({ value }: { value: number }) {
    this.value = value;
  }
}

export const incrementSchema: borsh.Schema = {
  struct: {
    value: 'u32'
  }
}

export const decrementSchema: borsh.Schema = {
  struct: {
    value: 'u32'
  }
}

export const instructionSchema: borsh.Schema = {
  enum: [
    incrementSchema,
    decrementSchema
  ]
}

export function createIncrementInstructionData(value: number) {
  const instruction = new IncrementInstruction({ value });
  const serializedData = Buffer.from(borsh.serialize(instructionSchema, instruction));
  return serializedData;
}

export function createDecrementInstructionData(value: number) {
  const instruction = new DecrementInstruction({ value });
  const serializedData = Buffer.from(borsh.serialize(instructionSchema, instruction));
  return serializedData;
}

