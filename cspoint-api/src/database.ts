import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "cspoint";
const client = new MongoClient(connectionString);

export const collections: { users?: Collection } = {};

if (connectionString == "") {
  throw new Error("No connection string in .env");
}

let db: Db;

export async function initDb(): Promise<void> {
  try {
    await client.connect();
    db = client.db(dbName);
    collections.users = db.collection("users");
    console.log("Connected to database");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with DB connection: ${error.message}`);
    } else {
      console.log(`Error: ${error}`);
    }
  }
}

export async function closeDb(): Promise<void> {
  await client.close();
  console.log("Database connection closed");
}
