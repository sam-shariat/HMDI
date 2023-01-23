import algosdk from "algosdk";
import {
  algodClient,
  indexerClient,
  HMDINote,
  minRound,
  myAlgoConnect,
  numGlobalBytes,
  numGlobalInts,
  numLocalBytes,
  numLocalInts,
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/HMDI_approval.teal";
import clearProgram from "!!raw-loader!../contracts/HMDI_clear.teal";
import { base64ToUTF8String, utf8ToBase64String } from "./conversions";

class Product {
  constructor(
    name,
    image,
    description,
    link,
    donation,
    goaldonation,
    donated,
    uwallets,
    appId,
    owner
  ) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.link = link;
    this.donation = donation;
    this.goaldonation = goaldonation;
    this.donated = donated;
    this.uwallets = uwallets;
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
};

// CREATE PRODUCT: ApplicationCreateTxn
export const createProductAction = async (senderAddress, product) => {
  console.log("Adding Project...");

  let params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;

  // Compile programs
  const compiledApprovalProgram = await compileProgram(approvalProgram);
  const compiledClearProgram = await compileProgram(clearProgram);

  // Build note to identify transaction later and required app args as Uint8Arrays
  let note = new TextEncoder().encode(HMDINote);
  let name = new TextEncoder().encode(product.name);
  let image = new TextEncoder().encode(product.image);
  let description = new TextEncoder().encode(product.description);
  let link = new TextEncoder().encode(product.link);
  let donation = algosdk.encodeUint64(product.donation);
  let goaldonation = algosdk.encodeUint64(product.goaldonation);

  let appArgs = [name, image, description, link, donation, goaldonation];

  // Create ApplicationCreateTxn
  let txn = algosdk.makeApplicationCreateTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram: compiledApprovalProgram,
    clearProgram: compiledClearProgram,
    numLocalInts: numLocalInts,
    numLocalByteSlices: numLocalBytes,
    numGlobalInts: numGlobalInts,
    numGlobalByteSlices: numGlobalBytes,
    note: note,
    appArgs: appArgs,
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
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  // Get created application id and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["application-index"];
  console.log("Created new app-id: ", appId);
  return [appId, txId];
};

export const buyProductAction = async (senderAddress, product, count) => {
  console.log("Donating to Product...");

  let params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;

  // Build required app args as Uint8Array
  let buyArg = new TextEncoder().encode("donate");
  let countArg = algosdk.encodeUint64(count);
  let appArgs = [buyArg, countArg];

  // Create ApplicationCallTxn
  let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
    from: senderAddress,
    appIndex: product.appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    suggestedParams: params,
    appArgs: appArgs,
  });

  // Create PaymentTxn
  let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: product.owner,
    amount: product.donation * count,
    suggestedParams: params,
  });

  let txnArray = [appCallTxn, paymentTxn];

  // Create group transaction out of previously build transactions
  let groupID = algosdk.computeGroupID(txnArray);
  for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

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
};

export const deleteProductAction = async (senderAddress, index) => {
  console.log("Deleting application...");

  let params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;

  // Create ApplicationDeleteTxn
  let txn = algosdk.makeApplicationDeleteTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    appIndex: index,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  console.log("Signed transaction with txID: %s", txId);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  // Get application id of deleted application and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["txn"]["txn"].apid;
  console.log("Deleted app-id: ", appId);
};

//...
// GET PRODUCTS: Use indexer
export const getProductsAction = async () => {
  console.log("Fetching products...");
  let note = new TextEncoder().encode(HMDINote);
  let encodedNote = Buffer.from(note).toString("base64");

  // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
  let transactionInfo = await indexerClient
    .searchForTransactions()
    .notePrefix(encodedNote)
    .txType("appl")
    .minRound(minRound)
    .do();
  console.log(transactionInfo);
  let products = [];
  for (const transaction of transactionInfo.transactions) {
    let appId = transaction["created-application-index"];
    if (appId) {
      // Step 2: Get each application by application id
      let product = await getApplication(appId);
      if (product) {
        products.push(product);
      }
    }
  }
  console.log("Products fetched.");
  return products;
};

export const getProductAction = async (appId) => {
  console.log("Fetching product...");
  let note = new TextEncoder().encode(HMDINote);
  let encodedNote = Buffer.from(note).toString("base64");

  // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
  let transactionInfo = await indexerClient
    .searchForTransactions()
    .notePrefix(encodedNote)
    .applicationID(appId)
    .txType("appl")
    .minRound(minRound)
    .do();
  let products = [];
  for (const transaction of transactionInfo.transactions) {
    let appId = transaction["created-application-index"];
    if (appId) {
      // Step 2: Get each application by application id
      let product = await getApplication(appId);
      if (product) {
        products.push(product);
      }
    }
  }
  console.log("Product fetched.");
  return products;
};

const getApplication = async (appId) => {
  try {
    // 1. Get application by appId
    let response = await indexerClient
      .lookupApplications(appId)
      .includeAll(true)
      .do();
    if (response.application.deleted) {
      return null;
    }
    let globalState = response.application.params["global-state"];

    // 2. Parse fields of response and return product
    let owner = response.application.params.creator;
    let name = "";
    let image = "";
    let description = "";
    let link = "";
    let donation = 0;
    let goaldonation = 0;
    let donated = 0;
    let uwallets = 0;

    const getField = (fieldName, globalState) => {
      return globalState.find((state) => {
        return state.key === utf8ToBase64String(fieldName);
      });
    };

    if (getField("NAME", globalState) !== undefined) {
      let field = getField("NAME", globalState).value.bytes;
      name = base64ToUTF8String(field);
    }

    if (getField("IMAGE", globalState) !== undefined) {
      let field = getField("IMAGE", globalState).value.bytes;
      image = base64ToUTF8String(field);
    }

    if (getField("DESCRIPTION", globalState) !== undefined) {
      let field = getField("DESCRIPTION", globalState).value.bytes;
      description = base64ToUTF8String(field);
    }

    if (getField("LINK", globalState) !== undefined) {
      let field = getField("LINK", globalState).value.bytes;
      link = base64ToUTF8String(field);
    }

    if (getField("DONATION", globalState) !== undefined) {
      donation = getField("DONATION", globalState).value.uint;
    }

    if (getField("GOALDONATION", globalState) !== undefined) {
      goaldonation = getField("GOALDONATION", globalState).value.uint;
    }

    if (getField("DONATED", globalState) !== undefined) {
      donated = getField("DONATED", globalState).value.uint;
    }

    if (getField("UWALLETS", globalState) !== undefined) {
      uwallets = getField("UWALLETS", globalState).value.uint;
    }

    return new Product(
      name,
      image,
      description,
      link,
      donation,
      goaldonation,
      donated,
      uwallets,
      appId,
      owner
    );
  } catch (err) {
    return null;
  }
};
