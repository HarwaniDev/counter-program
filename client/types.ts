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

class IncrementInstruction {
  value: number;
  constructor({ value }: { value: number }) {
    this.value = value;
  }
}

class DecrementInstruction {
  value: number;
  constructor({ value }: { value: number }) {
    this.value = value;
  }
}

const instructionSchema = new Map<any, any>([
  [IncrementInstruction, { value: 'u32' }],
  [DecrementInstruction, { value: 'u32' }],
]);

export function createIncrementInstructionData(value: number): Buffer {
  const instruction = new IncrementInstruction({ value });
  const serializedData = borsh.serialize(instructionSchema as unknown as borsh.Schema, instruction);
  const buffer = Buffer.alloc(1 + serializedData.length);
  buffer.writeUInt8(CounterInstructionType.Increment, 0);
  Buffer.from(serializedData).copy(buffer, 1);
  return buffer;
}

export function createDecrementInstructionData(value: number): Buffer {
  const instruction = new DecrementInstruction({ value });
  const serializedData = borsh.serialize(instructionSchema as unknown as borsh.Schema, instruction);
  const buffer = Buffer.alloc(1 + serializedData.length);
  buffer.writeUInt8(CounterInstructionType.Decrement, 0);
  Buffer.from(serializedData).copy(buffer, 1);
  return buffer;
}


