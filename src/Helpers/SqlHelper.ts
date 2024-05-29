import sqlite3 from 'sqlite3';

interface Card {
  name: string;
  uuid: string;
  isDoubleSided: boolean;
  scryfallID: string;
}

const db = new sqlite3.Database('AllPrintings.sql', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
});

export function getAllCardsLike(name: string, limit: number): Promise<Card[]> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM SmallerCards WHERE name like '%${name}%' LIMIT ${limit}`;
    db.all(sql, [], (err, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        const cards: Card[] = rows.map(row => ({
          name: row.name,
          uuid: row.uuid,
          isDoubleSided: row.isDoubleSided,
          scryfallID: row.scryfallID
        }));
        resolve(cards);
      }
    });
  });
}
