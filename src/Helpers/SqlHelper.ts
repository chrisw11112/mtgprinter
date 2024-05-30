// @ts-ignore
import initSqlJs from 'sql.js';

interface Card {
  name: string;
  uuid: string;
  isDoubleSided: boolean;
  scryfallID: string;
}
let db: any = null;

export async function initDb() {
  console.log("test");
  const SQL = await initSqlJs({
    locateFile: (file : string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm`
  });
  const response = await fetch('AllPrintings.sql'); // Adjust the path as necessary
  const buffer = await response.arrayBuffer();

  db = new SQL.Database(new Uint8Array(buffer));
}

export function getAllCardsLike(name: string, limit: number): Promise<Card[]> {
  if (!db) throw new Error("Database not initialized");

  const sql = `SELECT * FROM SmallerCards WHERE name LIKE '%${name}%' LIMIT ${limit}`;
  const result = db.exec(sql);

  if (result.length === 0) return Promise.resolve([]);

  const cards: Card[] = result[0].values.map((row: any[]) => ({
    name: row[0],
    uuid: row[1],
    isDoubleSided: row[2],
    scryfallID: row[3]
  }));

  return Promise.resolve(cards);
}
