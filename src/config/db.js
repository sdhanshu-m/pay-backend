import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/index.js'  // don't do mistake here(it was just a dot in starting)
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})
// never use url string inside code - never ever
 const prisma = new PrismaClient({ adapter })

export default prisma

// now import this wherever you need(mainly in service layer)
// '../generated/prisma/index.js'

// @neondatabase/serverless": "^1.0.2",
    // "@prisma/adapter-neon