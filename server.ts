import index from './html/index.html'
import { psmAnalysis } from './main'
import { convertCSV2JSON } from './util'

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/api/psm": {
        GET: async () => {
            const csvData = await convertCSV2JSON("PSMrawdata.csv")
            return Response.json({ data: psmAnalysis(csvData) })
        }
    }
  },
  websocket: {
    open(ws) {},
    message(ws, message) {},
    close(ws) {},
  }
});

console.log(`Listening on ${server.url}`)