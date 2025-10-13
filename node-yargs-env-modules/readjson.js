import fs from 'fs/promises';

export async function leerJson(path){
  const raw = await fs.readFile(path, 'utf8');
  return JSON.parse(raw);
}
