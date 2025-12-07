import * as fs from 'fs'
import * as path from 'path'

function traverseManifold1(map: string[][], row: number, col: number, splitterStarterCoordsSet: Set<string>): void {
    let currentRowIndex = row
    while (currentRowIndex < map.length) {
        console.log('Checking row at index', currentRowIndex, 'and col', col, 'with value', map[currentRowIndex][col])
        if (map[currentRowIndex][col] === '^') {
            if (!splitterStarterCoordsSet.has(`${currentRowIndex}${col}`)) {
                splitterStarterCoordsSet.add(`${currentRowIndex}${col}`)
                traverseManifold1(map, currentRowIndex + 1, col - 1, splitterStarterCoordsSet)
                traverseManifold1(map, currentRowIndex + 1, col + 1, splitterStarterCoordsSet)
            }
            break
        }
        currentRowIndex++
    }
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const map = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim().split('')).filter(line => line.length > 0)
    const sIndex = map[0].indexOf('S')
    const splitterStarterCoordsSet = new Set<string>()
    traverseManifold1(map, 1, sIndex, splitterStarterCoordsSet)
    console.log(`Result: ${splitterStarterCoordsSet.size}`)
}

function traverseManifold2(map: string[][], row: number, col: number, splitterStarterCoordsMap: Map<string, number>): number {
    let currentRowIndex = row
    while (currentRowIndex < map.length) {
        console.log('Checking row at index', currentRowIndex, 'and col', col, 'with value', map[currentRowIndex][col])
        if (map[currentRowIndex][col] === '^') {
            if (!splitterStarterCoordsMap.has(`${currentRowIndex}${col}`)) {
                const timelinesLeft = traverseManifold2(map, currentRowIndex + 1, col - 1, splitterStarterCoordsMap)
                const timelinesRight = traverseManifold2(map, currentRowIndex + 1, col + 1, splitterStarterCoordsMap)
                splitterStarterCoordsMap.set(`${currentRowIndex}${col}`, timelinesLeft + timelinesRight)
                return timelinesLeft + timelinesRight
            }
            return splitterStarterCoordsMap.get(`${currentRowIndex}${col}`) as number
        }
        currentRowIndex++
    }
    return 1
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const map = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim().split('')).filter(line => line.length > 0)
    const sIndex = map[0].indexOf('S')
    const splitterStarterCoordsMap = new Map<string, number>()
    const timelines = traverseManifold2(map, 1, sIndex, splitterStarterCoordsMap)
    console.log(`Result: ${timelines}`)
}

part2()