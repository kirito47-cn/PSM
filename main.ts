import type { PSMCurves, PSMPercent, PSMResponse } from "./interface";
import { convertCSV2JSON } from "./util";

// TODO:  support input the file name in terminal
// convertCSV2JSON("PSMrawdata.csv").then(res => {
//     psmAnalysis(res)
// })


export function psmAnalysis(responses: PSMResponse[]): PSMCurves {
    const len = responses.length
    if (len === 0) throw new Error("empty data!")

    const allPrices = responses.flatMap(r => [r.tooCheap, r.cheap, r.expensive, r.tooExpensive])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const step = 40 // step is important.

    const prices = []
    for (let start = minPrice; start <= maxPrice; start+= step) {
        prices.push(start)
    }
    
    const curveTooCheap: PSMPercent[] = prices.map(p => ({p, v: pctTooCheap(p, responses)}))
    const curveCheap: PSMPercent[] = prices.map(p => ({p, v: pctCheap(p, responses)}))
    const curveExpensive: PSMPercent[] = prices.map(p => ({p, v: pctExpensive(p, responses)}))
    const curveTooExpensive: PSMPercent[] = prices.map(p => ({p, v: pctTooExpensive(p, responses)}))

    // OPP　理想価格
    console.log("理想価格 (OPP): ", findInterSection(curveTooCheap, curveTooExpensive))
    // IPP　妥協価格
    console.log("妥協価格 (IPP): ", findInterSection(curveCheap, curveExpensive))
    // PME  最高価格
    console.log("最高価格 (PME): ", findInterSection(curveCheap, curveTooExpensive))
    // PMC  最低品質保証価格    
    console.log("最低品質保証価格 (PMC): ", findInterSection(curveTooCheap, curveExpensive))

    return {
        curveTooCheap,
        curveCheap,
        curveExpensive,
        curveTooExpensive
    }
}

// calc the percent of each price
function pctTooCheap(p: number, responses: PSMResponse[]) {
 return responses.filter(r => p <= r.tooCheap).length / responses.length
}

function pctCheap(p: number, responses: PSMResponse[]) {
 return responses.filter(r => p <= r.cheap).length / responses.length
}

function pctExpensive(p: number, responses: PSMResponse[]) {
 return responses.filter(r => p > r.expensive).length / responses.length
}

function pctTooExpensive(p: number, responses: PSMResponse[]) {
 return responses.filter(r => p > r.tooExpensive).length / responses.length
}

// func to find the intersection
function findInterSection(curA: PSMPercent[], curB: PSMPercent[]) {

    for (let index = 0; index < curA.length - 1; index++) {
        //TODO: dirty data
        const a1 = curA[index]?.v, a2 = curA[index+1]?.v
        const b1 = curB[index]?.v, b2 = curB[index+1]?.v

        if (a1 === undefined  || a2 === undefined  || b1 === undefined || b2 === undefined) throw new Error("dirty data found!")
        const diff1 = a1 - b1, diff2 = a2 - b2

        if (diff1 === 0) return curA[index]?.p

        // intersect happend
        if (diff1 * diff2 < 0) {
            const t = diff1 / (diff1 - diff2)
            return curA[index]!!.p + t * (curA[index+1]!!.p - curA[index]!!.p)
        }
    }
    return null
}