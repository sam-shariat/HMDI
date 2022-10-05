import algosdk from "algosdk";
import {
    algodClient,
    indexerClient,
    HMDICommentsNote,
    minRound,
    myAlgoConnect,
    numGlobalBytesComments,
    numGlobalIntsComments,
    numLocalBytes,
    numLocalInts
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/HMDI_comments_approval.teal";
import clearProgram from "!!raw-loader!../contracts/HMDI_comments_clear.teal";
import { base64ToUTF8String, utf8ToBase64String } from "./conversions";

class Comments {
    constructor(uid, comment, appId, owner) {
        this.uid = uid;
        this.comment = comment;
        this.appId = appId;
        this.owner = owner;
    }
}

// Compile smart contract in .teal format to program
const compileProgram = async (programSource) => {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await algodClient.compile(programBytes).do();
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

// CREATE PRODUCT: ApplicationCreateTxn
export const createCommentAction = async (senderAddress, comments, uid) => {
    console.log("Adding Comment..." + uid)
    console.log(comments);
    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Compile programs
    const compiledApprovalProgram = await compileProgram(approvalProgram)
    const compiledClearProgram = await compileProgram(clearProgram)

    // Build note to identify transaction later and required app args as Uint8Arrays
    let note = new TextEncoder().encode(HMDICommentsNote);
    let comment = new TextEncoder().encode(comments.comment);
    let uidd = algosdk.encodeUint64(Number(uid));
    let appArgs = [uidd, comment]

    // Create ApplicationCreateTxn
    let txn = algosdk.makeApplicationCreateTxnFromObject({
        from: senderAddress,
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: compiledApprovalProgram,
        clearProgram: compiledClearProgram,
        numLocalInts: numLocalInts,
        numLocalByteSlices: numLocalBytes,
        numGlobalInts: numGlobalIntsComments,
        numGlobalByteSlices: numGlobalBytesComments,
        note: note,
        appArgs: appArgs
    });

    // Get transaction ID
    let txId = txn.txID().toString();

    // Sign & submit the transaction
    let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("Signed transaction with txID: %s", txId);
    await algodClient.sendRawTransaction(signedTxn.blob).do();

    // Wait for transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    // Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // Get created application id and notify about completion
    let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
    let appId = transactionResponse['application-index'];
    console.log("Created new app-id: ", appId);
    return [appId,txId];
}


//...
// GET PRODUCTS: Use indexer
export const getCommentsAction = async (uid) => {
    console.log("Fetching comments...")
    let note = new TextEncoder().encode(HMDICommentsNote);
    let encodedNote = Buffer.from(note).toString("base64");

    // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
    let transactionInfo = await indexerClient.searchForTransactions()
        .notePrefix(encodedNote)
        .txType("appl")
        .minRound(minRound)
        .do();
    let comments = []
    for (const transaction of transactionInfo.transactions) {
        let appId = transaction["created-application-index"]
        if (appId) {
            // Step 2: Get each application by application id
            let comment = await getApplication(appId, uid)
            if (comment) {
                comments.push(comment)
            }
        }
    }
    console.log("Comments fetched.")
    return comments
}

const getApplication = async (appId, uidd) => {
    try {
        // 1. Get application by appId
        let response = await indexerClient.lookupApplications(appId).includeAll(true).do();
        if (response.application.deleted) {
            return null;
        }
        let globalState = response.application.params["global-state"]

        // 2. Parse fields of response and return product
        let owner = response.application.params.creator
        let comment = ""
        let uid = ""

        const getField = (fieldName, globalState) => {
            return globalState.find(state => {
                return state.key === utf8ToBase64String(fieldName);
            })
        }

        if (getField("COMMENT", globalState) !== undefined) {
            let field = getField("COMMENT", globalState).value.bytes
            comment = base64ToUTF8String(field)
        }

        if (getField("UID", globalState) !== undefined) {
            uid = getField("UID", globalState).value.uint
        }

        if (uidd === uid) {
            return new Comments(uid, comment, appId, owner)
        } else {
            return null
        }
    } catch (err) {
        return null;
    }
}