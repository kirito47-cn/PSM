import * as fs from "fs"
import * as path from "path"
import { parse } from "csv-parse"
import { keyMap, type PSMResponse } from "./interface"

function convertRow(row: Record<string, string>): PSMResponse {
  const result: any = {};

  for (const [jpKey, value] of Object.entries(row)) {
    const enKey = keyMap[jpKey];
    if (!enKey) continue;

    result[enKey] = Number(value);
  }

  return result as PSMResponse;
}

export async function convertCSV2JSON(file: string): Promise<PSMResponse[]> {
    const csvPath = path.resolve(__dirname, `./data/${file}`)
    return new Promise((resolve, reject) => {
        const results: PSMResponse[] = [];

        fs.createReadStream(csvPath)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => {
            const converted = convertRow(row)
            results.push({
                sampleNumber: Number(converted.sampleNumber),
                tooCheap: Number(converted.tooCheap),
                cheap: Number(converted.cheap),
                expensive: Number(converted.expensive),
                tooExpensive: Number(converted.tooExpensive),
            });
        })
        .on("end", () => resolve(results))
        .on("error", reject);
    })
}