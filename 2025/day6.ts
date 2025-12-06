import * as fs from 'fs'
import * as path from 'path'

function doMath1(map: string[][]): number {
    let total = 0
    const width = map[0].length
    const height = map.length
    for (let i = 0; i < width; i++) {
        console.log(`Processing column ${i}`)
        const operation = map[height - 1][i]
        console.log(`Operation: ${operation}`)
        let subtotal = operation === '+' ? 0 : 1
        for (let j = 0; j < height - 1; j++) {
            console.log(`Processing value: ${map[j][i]}`)
            if (operation === '+') subtotal += Number(map[j][i])
            if (operation === '*') subtotal *= Number(map[j][i])
        }
        total += subtotal
    }
    return total
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const map = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim().replace(/\s+/g, ' ').split(' ')).filter(line => line.length > 1)
    const result = doMath1(map)
    console.log(`Result: ${result}`)
}

function processColumn(width: number, map: string[], operation: string): number {
    const numbers: string[] = []
    console.log(`Processing column of width ${width}`)
    for (let i = 0; i < map.length - 1; i++) {
        const row = map[i].substring(0, width)
        console.log('Processing row:', row)
        for (let j = width; j > 0; j--) {
            numbers[j] = (numbers[j] || '') + row[width - j]
        }
        map[i] = map[i].substring(width + 1)
    }
    const subTotal = numbers.reduce((acc, number) => {
        if (operation === '+') return acc + Number(number)
        if (operation === '*') return acc * Number(number)
        return acc
    }, operation === '+' ? 0 : 1)
    return subTotal
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const map = fs.readFileSync(inputPath, 'utf-8').split('\n').filter(line => line.length > 1)
    const columnWidths = map[map.length - 1].split(/[*+]/g).map(col => col.length).slice(1, -1)
    const operations = map[map.length - 1].trim().replace(/\s+/g, ' ').split(' ')
    let total = 0
    for (let widthIndex = 0; widthIndex < columnWidths.length; widthIndex++) {
        const width = columnWidths[widthIndex]
        const operation = operations[widthIndex]

        const subTotal = processColumn(width, map, operation)
        console.log(`Subtotal for column ${widthIndex}: ${subTotal}`)
        total += subTotal
    }

    const lastColumnTotal = processColumn(map[0].length, map, operations.at(-1)!)
    console.log(`Subtotal for last column: ${lastColumnTotal}`)
    total += lastColumnTotal

    console.log(`Final total: ${total}`)

}

part2()