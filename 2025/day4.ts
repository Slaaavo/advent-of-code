import * as fs from 'fs'
import * as path from 'path'

type rollsMap = string[][]

function checkRollAccessibility(rolls: rollsMap, row: number, column: number): boolean {
    const leftIndex = Math.max(0, column - 1)
    const rightIndex = Math.min(rolls[row].length - 1, column + 1)
    const topIndex = Math.max(0, row - 1)
    const bottomIndex = Math.min(rolls.length - 1, row + 1)
    let adjacentRolls = 0
    for (let r = topIndex; r <= bottomIndex; r++) {
        for (let c = leftIndex; c <= rightIndex; c++) {
            if (r === row && c === column) continue
            if (rolls[r][c] === '@') adjacentRolls++
        }
    }
    return adjacentRolls < 4
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const rollsMap = fs.readFileSync(inputPath, 'utf-8').split('\n').filter(line => line.length > 0).map(line => line.split(''))
    let accessibleRolls = 0
    for (let row = 0; row < rollsMap.length; row++) {
        for (let column = 0; column < rollsMap[row].length; column++) {
            if (rollsMap[row][column] === '@') {
                accessibleRolls += Number(checkRollAccessibility(rollsMap, row, column))
            }
        }
    }
    console.log(`Accessible rolls: ${accessibleRolls}`)
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const rollsMap = fs.readFileSync(inputPath, 'utf-8').split('\n').filter(line => line.length > 0).map(line => line.split(''))
    let removedRolls = 0
    let successfulRemoval = false
    do {
        successfulRemoval = false
        for (let row = 0; row < rollsMap.length; row++) {
            for (let column = 0; column < rollsMap[row].length; column++) {
                if (rollsMap[row][column] === '@') {
                    if (checkRollAccessibility(rollsMap, row, column)) {
                        rollsMap[row][column] = '.'
                        successfulRemoval = true
                        removedRolls++
                    }
                }
            }
        }
    } while (successfulRemoval)

    console.log(`Removed rolls: ${removedRolls}`)
}

part2()