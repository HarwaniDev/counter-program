import { test, expect } from "bun:test";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { COUNTER_SIZE, CounterAccount, createIncrementInstructionData, schema } from "./types";
import * as borsh from "borsh";

const adminAccount = Keypair.generate();
const dataAccount = Keypair.generate();
const programId = new PublicKey("9P6N5N3zY3zZj6CMwy6Tr6zUz6s9UZ5VQt8Mpd6Mxq3k");
const connection = new Connection("http://127.0.0.1:8899");
test("Accounts are initialized", async () => {
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 5 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);

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

    const counterAccount = await connection.getAccountInfo(dataAccount.publicKey);
    if (!counterAccount) {
        throw new Error("Counter account not found");
    }
    const counter = borsh.deserialize(schema, counterAccount.data) as CounterAccount;
    expect(counter.counter).toBe(0);
});

test("Counter does increase", async () => {
    const tx = new Transaction();
    const data = createIncrementInstructionData(1);
    tx.add(new TransactionInstruction({
        keys: [{
            pubkey: dataAccount.publicKey,
            isSigner: true,
            isWritable: true
        }],
        programId: programId,
        data: data
    }));
    const signature = await connection.sendTransaction(tx, [adminAccount, dataAccount]);
    await connection.confirmTransaction(signature);
    
        const counterAccount = await connection.getAccountInfo(dataAccount.publicKey);
    if (!counterAccount) {
        throw new Error("Counter account not found");
    }
    
    const counter = borsh.deserialize(schema, counterAccount.data) as CounterAccount;
    expect(counter.counter).toBe(1);

})

