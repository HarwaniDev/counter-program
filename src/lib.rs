use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

entrypoint!(counter_contract);

#[derive(BorshSerialize, BorshDeserialize)]
enum InstructionType {
    Increment(u32),
    Decrement(u32),
}

#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    counter: u32
}

pub fn counter_contract(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let acc = next_account_info(&mut accounts.iter())?;
    let instruction_type = InstructionType::try_from_slice(&instruction_data)?;
    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;
    match instruction_type {
        InstructionType::Increment(value) => {
            msg!("executing increment instruction");
            counter_data.counter += value;
        },
        InstructionType::Decrement(value) => {
            msg!("executing decrement instruction");
            counter_data.counter -= value;
        }
    }
    counter_data.serialize(&mut *acc.data.borrow_mut())?;
    msg!("program executed");
    Ok(())
}