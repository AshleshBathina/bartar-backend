import { Pool } from "pg"
import "./env.js";

const pool = new Pool({connectionString: process.env.DB_URL});

export default pool;
