import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

const config = {
    algodToken: "",
    algodServer: "https://node.testnet.algoexplorerapi.io",
    algodPort: "",
    indexerToken: "",
    indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
    indexerPort: "",
}

export const algoExpTest = "https://testnet.algoexplorer.io/";
export const algoExp = "https://algoexplorer.io/";

export const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort)

export const indexerClient = new algosdk.Indexer(config.indexerToken, config.indexerServer, config.indexerPort);

export const myAlgoConnect = new MyAlgoConnect();

export const minRound = 21540981;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const HMDINote = "HMDI:uv001"
export const HMDICommentsNote = "HMDI-comments:uv001"
export const HMDIProfilesNote = "HMDI-profiles:uv01"

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalInts = 4; // Global variables stored as Int: count, sold, 
export const numGlobalIntsComments = 1; // Global variables stored as Int: count, sold
export const numGlobalIntsProfiles = 0; // Global variables stored as Int: count, sold
export const numGlobalBytes = 4; // Global variables stored as Bytes: name, description, image, link
export const numGlobalBytesComments = 1; // Global variables stored as Bytes: name, description, image, link
export const numGlobalBytesProfiles = 4; // Global variables stored as Bytes: name, description, image, link
export const ALGORAND_DECIMALS = 6;

