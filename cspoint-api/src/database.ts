import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import { Team } from "./models/team";
import { Match } from "./models/match";
import { Player } from "./models/player";

dotenv.config();

const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "cspoint";
const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const collections: { users?: Collection; teams?: Collection<Team>; matches?: Collection<Match>, players?: Collection<Player> } = {};

if (connectionString == "") {
  throw new Error("No connection string in .env");
}

let db: Db;

export async function initDb(): Promise<void> {
  try {
    await client.connect();
    db = client.db(dbName);
    collections.users = db.collection("users");
    collections.teams = db.collection<Team>("teams");
    collections.players = db.collection<Player>("players");
    collections.matches = db.collection<Match>("matches");
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
