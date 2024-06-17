import KeyDIDResolver from "key-did-resolver";
import { randomBytes } from "crypto";
import { toString } from "uint8arrays/to-string";
import { writeFile } from "fs";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";

export const RunCommands = async () => {
  const generateAdminKeyDid = async () => {
    const seed = new Uint8Array(randomBytes(32));
    const keyResolver = KeyDIDResolver.getResolver();
    const did = new DID({
      provider: new Ed25519Provider(seed),
      resolver: {
        ...keyResolver,
      },
    });
    await did.authenticate();
    return {
      adminSeed: toString(seed, "base16"),
      adminDid: did,
    };
  };
  const generateNodeKeyDid = async () => {
    const seed = new Uint8Array(randomBytes(32));
    const keyResolver = KeyDIDResolver.getResolver();
    const did = new DID({
      provider: new Ed25519Provider(seed),
      resolver: {
        ...keyResolver,
      },
    });
    await did.authenticate();
    return {
      nodeSeed: toString(seed, "base16"),
      nodeDid: did,
    };
  };

  const { adminSeed, adminDid } = await generateAdminKeyDid();
  const { nodeSeed, nodeDid } = await generateNodeKeyDid();
  console.log("Admin Credentials: ", adminSeed, adminDid);
  console.log("Node Credentials: ", nodeSeed, nodeDid);

  const generateLocalConfig = async (
    adminSeed,
    adminDid,
    nodeSeed,
    nodeDid
  ) => {
    const configData = {
      anchor: {
        "auth-method": "did",
      },
      "http-api": {
        "cors-allowed-origins": [".*"],
        "admin-dids": [adminDid.id],
      },
      ipfs: {
        mode: "remote",
        host: "http://localhost:5001",
        "disable-peer-data-sync": false,
      },
      logger: {
        "log-level": 2,
        "log-to-files": false,
      },
      metrics: {
        "prometheus-exporter-enabled": true,
        "prometheus-exporter-port": 9464,
      },
      network: {
        name: "mainnet",
      },
      node: {
        privateSeedUrl: `inplace:ed25519#${nodeSeed}`,
      },
      "state-store": {
        mode: "fs",
        "local-directory": `${process.cwd()}/.ceramic/statestore/`,
      },
      indexing: {
        db: `postgres://admin:admin@localhost:5432/postgres`,
        "allow-queries-before-historical-sync": true,
      },
    };
    writeFile(
      `${process.cwd()}/daemon.config.json`,
      JSON.stringify(configData),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    writeFile(`${process.cwd()}/node_did.txt`, nodeDid.id, (err) => {
      if (err) {
        console.error(err);
      }
    });
    writeFile(`${process.cwd()}/admin_seed.txt`, adminSeed, (err) => {
      if (err) {
        console.error(err);
      }
    });
  };
  await generateLocalConfig(adminSeed, adminDid, nodeSeed, nodeDid);
};
RunCommands();
