export interface PSMResponse {
    sampleNumber: number
    tooCheap: number
    cheap: number
    expensive: number
    tooExpensive: number
}

export interface PSMPercent {
    p: number // the price
    v: number // the percent in all prices
}

export interface PSMCurves {
    curveTooCheap: PSMPercent[]
    curveCheap: PSMPercent[]
    curveExpensive: PSMPercent[]
    curveTooExpensive: PSMPercent[]
}

export const keyMap: Record<string, keyof PSMResponse> = {
  "sample number": "sampleNumber",
  "高い": "expensive",
  "安い": "cheap",
  "高すぎる": "tooExpensive",
  "安すぎる": "tooCheap",
};