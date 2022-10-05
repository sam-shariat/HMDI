import algosdk from "algosdk";
import {
    algodClient,
    indexerClient,
    HMDIProfilesNote,
    minRound,
    myAlgoConnect,
    numGlobalBytesProfiles,
    numGlobalIntsProfiles,
    numLocalBytes,
    numLocalInts
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/HMDI_profile_approval.teal";
import clearProgram from "!!raw-loader!../contracts/HMDI_profile_clear.teal";
import { base64ToUTF8String, utf8ToBase64String } from "./conversions";

class Profile {
    constructor(name, image, bio, link, appId, owner) {
        this.name = name;
        this.image = image;
        this.bio = bio;
        this.link = link;
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
export const createProfileAction = async (senderAddress, profile) => {
    console.log("Adding Profile..." + senderAddress)
    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Compile programs
    const compiledApprovalProgram = await compileProgram(approvalProgram)
    const compiledClearProgram = await compileProgram(clearProgram)

    // Build note to identify transaction later and required app args as Uint8Arrays
    let note = new TextEncoder().encode(HMDIProfilesNote);
    let name = new TextEncoder().encode(profile.name);
    let image = new TextEncoder().encode(profile.image);
    let bio = new TextEncoder().encode(profile.bio);
    let link = new TextEncoder().encode(profile.link);
    let appArgs = [name, image, bio, link]

    // Create ApplicationCreateTxn
    let txn = algosdk.makeApplicationCreateTxnFromObject({
        from: senderAddress,
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: compiledApprovalProgram,
        clearProgram: compiledClearProgram,
        numLocalInts: numLocalInts,
        numLocalByteSlices: numLocalBytes,
        numGlobalInts: numGlobalIntsProfiles,
        numGlobalByteSlices: numGlobalBytesProfiles,
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
    return [appId, txId];
}

export const editProfileAction = async (senderAddress, profile) => {
    console.log("Edit Profile...");

    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Build required app args as Uint8Array
    let editArg = new TextEncoder().encode("edit");
    let name = new TextEncoder().encode(profile.name);
    let image = new TextEncoder().encode(profile.image);
    let bio = new TextEncoder().encode(profile.bio);
    let link = new TextEncoder().encode(profile.link);
    let appArgs = [editArg, name, image, bio, link];

    // Create ApplicationCallTxn
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: senderAddress,
        appIndex: profile.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        suggestedParams: params,
        appArgs: appArgs,
    });

    let txnArray = [appCallTxn];

    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray);
    for (let i = 0; i < 1; i++) txnArray[i].group = groupID;

    // Sign & submit the group transaction
    let signedTxn = await myAlgoConnect.signTransaction(
        txnArray.map((txn) => txn.toByte())
    );
    console.log("Signed group transaction");
    let tx = await algodClient
        .sendRawTransaction(signedTxn.map((txn) => txn.blob))
        .do();

    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

    // Notify about completion
    console.log(
        "Group transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
    return [profile.appId, tx.txId];
};
//...
// GET PRODUCTS: Use indexer
export const getProfileAction = async (senderAddress) => {
    console.log("Fetching Profile...")
    let note = new TextEncoder().encode(HMDIProfilesNote);
    let encodedNote = Buffer.from(note).toString("base64");

    // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
    let transactionInfo = await indexerClient.searchForTransactions()
        .notePrefix(encodedNote)
        .address(senderAddress)
        .txType("appl")
        .minRound(minRound)
        .do();
    let profiles = []
    for (const transaction of transactionInfo.transactions) {
        let appId = transaction["created-application-index"]
        if (appId) {
            // Step 2: Get each application by application id
            let profile = await getApplication(appId)
            if (profile) {
                profiles.push(profile)
            }
        }
    }
    console.log("Profile fetched.")
    return profiles
}

const getApplication = async (appId) => {
    try {
        // 1. Get application by appId
        let response = await indexerClient.lookupApplications(appId).includeAll(true).do();
        if (response.application.deleted) {
            return null;
        }
        let globalState = response.application.params["global-state"]

        // 2. Parse fields of response and return product
        let owner = response.application.params.creator
        let name = ""
        let image = ""
        let bio = ""
        let link = ""

        const getField = (fieldName, globalState) => {
            return globalState.find(state => {
                return state.key === utf8ToBase64String(fieldName);
            })
        }

        if (getField("NAME", globalState) !== undefined) {
            let field = getField("NAME", globalState).value.bytes
            name = base64ToUTF8String(field)
        }

        if (getField("IMAGE", globalState) !== undefined) {
            let field = getField("IMAGE", globalState).value.bytes
            image = base64ToUTF8String(field)
        }

        if (getField("BIO", globalState) !== undefined) {
            let field = getField("BIO", globalState).value.bytes
            bio = base64ToUTF8String(field)
        }

        if (getField("LINK", globalState) !== undefined) {
            let field = getField("LINK", globalState).value.bytes
            link = base64ToUTF8String(field)
        }

        return new Profile(name, image, bio, link, appId, owner)
    } catch (err) {
        return null;
    }
}