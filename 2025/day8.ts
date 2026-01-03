import * as fs from 'fs'
import * as path from 'path'

function calculateDistance(box1: string, box2: string): number {
    const [x1, y1, z1] = box1.split(',').map(Number)
    const [x2, y2, z2] = box2.split(',').map(Number)
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2)
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const boxes = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const distanceMap = new Map<number, string[][]>()
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const distance = calculateDistance(boxes[i], boxes[j])
            distanceMap.set(distance, (distanceMap.get(distance) ?? []).concat([[boxes[i], boxes[j]]]))
        }
    }

    let circuitId = 0

    const circuitMap = new Map<string, number>()
    const distancesSorted = Array.from(distanceMap.keys()).sort((a, b) => a - b)
    let connectionsMade = 0
    for (const distance of distancesSorted) {
        const boxPairs = distanceMap.get(distance) as string[][]
        for (const [box1, box2] of boxPairs) {
            const circuit1 = circuitMap.get(box1)
            const circuit2 = circuitMap.get(box2)
            if (!circuit1 && !circuit2) {
                circuitMap.set(box1, circuitId)
                circuitMap.set(box2, circuitId)
                circuitId++
            } else if (circuit1 && !circuit2) {
                circuitMap.set(box2, circuit1)
            } else if (!circuit1 && circuit2) {
                circuitMap.set(box1, circuit2)
            } else if (circuit1 !== circuit2) {
                for (const [box, circuit] of circuitMap.entries()) {
                    if (circuit === circuit2) {
                        circuitMap.set(box, circuit1!)
                    }
                }
            }
        }
        connectionsMade++
        if (connectionsMade >= 1000) break
        console.log(`Connections made: ${connectionsMade}`)
        console.log(`Unique circuits: ${new Set(circuitMap.values()).size}`)
    }

    const circuitSizes = circuitMap.values().reduce((acc, circuit) => {
        acc[circuit] = (acc[circuit] ?? 0) + 1
        return acc
    }, {} as Record<number, number>)

    const sortedCircuitSizes = Object.values(circuitSizes).sort((a, b) => b - a)
    console.log(`Result: ${sortedCircuitSizes[0] * (sortedCircuitSizes[1] ?? 1) * (sortedCircuitSizes[2] ?? 1)}`)
    console.log('Sorted circuit sizes:', sortedCircuitSizes)


}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const boxes = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const distanceMap = new Map<number, string[][]>()
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const distance = calculateDistance(boxes[i], boxes[j])
            distanceMap.set(distance, (distanceMap.get(distance) ?? []).concat([[boxes[i], boxes[j]]]))
        }
    }

    let circuitId = 0

    const circuitMap = new Map<string, number>()
    const distancesSorted = Array.from(distanceMap.keys()).sort((a, b) => a - b)
    let connectionsMade = 0
    for (const distance of distancesSorted) {
        const boxPairs = distanceMap.get(distance) as string[][]
        for (const [box1, box2] of boxPairs) {
            const circuit1 = circuitMap.get(box1)
            const circuit2 = circuitMap.get(box2)
            if (!circuit1 && !circuit2) {
                circuitMap.set(box1, circuitId)
                circuitMap.set(box2, circuitId)
                circuitId++
            } else if (circuit1 && !circuit2) {
                circuitMap.set(box2, circuit1)
            } else if (!circuit1 && circuit2) {
                circuitMap.set(box1, circuit2)
            } else if (circuit1 !== circuit2) {
                for (const [box, circuit] of circuitMap.entries()) {
                    if (circuit === circuit2) {
                        circuitMap.set(box, circuit1!)
                    }
                }
            }
        }
        connectionsMade++
        const numberOfCircuits = new Set(circuitMap.values()).size
        if (circuitMap.size === boxes.length && numberOfCircuits === 1) {
            console.log('Last box pair that connected everything:', boxPairs[0])
            const result = Number(boxPairs[0][0].split(',')[0]) * Number(boxPairs[0][1].split(',')[0])
            console.log(`Result: ${result}`)
            break
        }
    }


}

part2()