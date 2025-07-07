import { test, expect } from "bun:test";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { COUNTER_SIZE, CounterAccount, schema } from "./types";
import * as borsh from "borsh";

const adminAccount = Keypair.generate();
const dataAccount = Keypair.generate();
const programId = "DVoisAQ2HJLCv53khV4GZWim7gbYuywdTCC2r9Pmxi7c";

test("Accounts are initialized", async () => {
    const connection = new Connection("http://localhost:8899");
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 5 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);
    console.log("here");
    
    const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);
    const ix = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: lamports,
        space: COUNTER_SIZE,
        programId: new PublicKey(programId)
    });
    const createDataAccountTransaction = new Transaction();
    createDataAccountTransaction.add(ix);
    const signature = await connection.sendTransaction(createDataAccountTransaction, [adminAccount, dataAccount]);
    await connection.confirmTransaction(signature);
    console.log("now here");
    

    const counterAccount = await connection.getAccountInfo(dataAccount.publicKey);
    if (!counterAccount) {
        throw new Error("Counter account not found");
    }
    const counter = borsh.deserialize(schema, counterAccount.data) as CounterAccount;
    console.log(counter.counter);
    expect(counter.counter).toBe(0);
})  