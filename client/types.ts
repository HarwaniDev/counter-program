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

export const instructionSchema: borsh.Schema = {
  enum: [
    {
      struct: {
        Increment: {
          struct: {
            value: 'u32'
          }
        }
      }
    },
    {
      struct: {
        Decrement: {
          struct: {
            value: 'u32'
          }
        }
      }
    }
  ]
};


export function createIncrementInstructionData(value: number) {
  const instruction = {
    Increment: {
      value
    }
  };
  const serializedData = Buffer.from(borsh.serialize(instructionSchema, instruction));
  return serializedData;
}

export function createDecrementInstructionData(value: number) {
  const instruction = {
    Decrement: {
      value
    }
  };
  const serializedData = Buffer.from(borsh.serialize(instructionSchema, instruction));
  return serializedData;
}
