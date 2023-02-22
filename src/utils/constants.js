import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

const config = {
  algodToken: "",
  algodServer: "https://testnet-api.algonode.cloud",
  algodPort: "",
  indexerToken: "",
  indexerServer: "https://testnet-idx.algonode.cloud",
  indexerPort: "",
};

export const algoExpTest = "https://testnet.algoexplorer.io/";
export const algoExp = "https://algoexplorer.io/";

export const algodClient = new algosdk.Algodv2(
  config.algodToken,
  config.algodServer,
  config.algodPort
);

export const indexerClient = new algosdk.Indexer(
  config.indexerToken,
  config.indexerServer,
  config.indexerPort
);

export const BASE_URL = "https://sam-shariat.github.io/HMDI/";

export const myAlgoConnect = new MyAlgoConnect();

export const minRound = 26540981;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const HMDINote = "HMDI:uv002";
export const HMDICommentsNote = "HMDI-comments:uv002";
export const HMDIProfilesNote = "HMDI-profiles:uv002";

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalInts = 4; // Global variables stored as Int: donation, donated, goaldonation, uwallets,
export const numGlobalIntsComments = 1; // Global variables stored as Int: uid
export const numGlobalIntsProfiles = 0; // Global variables
export const numGlobalBytes = 4; // Global variables stored as Bytes: name, description, image, link
export const numGlobalBytesComments = 1; // Global variables stored as Bytes: comment
export const numGlobalBytesProfiles = 4; // Global variables stored as Bytes: name, image, bio, link
export const ALGORAND_DECIMALS = 6;
