import * as fs from 'fs'
import * as path from 'path'

function checkIngredientInRange(ingredient: number, range: string): boolean {
    const [minId, maxId] = range.split('-')
    return ingredient >= Number(minId) && ingredient <= Number(maxId)
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const [ranges, ingredients] = fs.readFileSync(inputPath, 'utf-8').split('\n\n')
        .map(section => section.split('\n').filter(line => line.length > 0))
    let freshIngredientsCount = 0
    for (const ingredient of ingredients) {
        freshIngredientsCount += ranges.some(range => checkIngredientInRange(Number(ingredient), range)) ? 1 : 0
    }
    console.log(`Fresh ingredients count: ${freshIngredientsCount}`)
}

// part1()

class Range {
    minId: number
    maxId: number

    constructor(rangeStr: string) {
        const [minId, maxId] = rangeStr.split('-')
        this.minId = Number(minId)
        this.maxId = Number(maxId)
    }

    mergeRange(range: string): boolean {
        const [minId, maxId] = range.split('-').map(id => Number(id))
        if (minId <= this.minId && maxId >= this.maxId) {
            this.minId = minId
            this.maxId = maxId
            return true
        }
        if (minId <= this.minId && maxId >= this.minId && maxId <= this.maxId) {
            this.minId = minId
            return true
        }
        if (minId >= this.minId && minId <= this.maxId && maxId >= this.maxId) {
            this.maxId = maxId
            return true
        }
        if (minId >= this.minId && maxId <= this.maxId) {
            return true
        }
        return false
    }

    rangeSize(): number {
        return this.maxId - this.minId + 1
    }

    toString(): string {
        return `${this.minId}-${this.maxId}`
    }
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const [ranges] = fs.readFileSync(inputPath, 'utf-8').split('\n\n')
        .map(section => section.split('\n').filter(line => line.length > 0))
    const mergedRanges: string[] = []
    for (const range of ranges) {
        console.log('----- MERGED RANGES -----')
        console.log(mergedRanges)
        console.log('------------------------')
        console.log(`Processing range: ${range}`)
        const smartRange = new Range(range)
        const toRemoveIndices: number[] = []
        for (let i = 0; i < mergedRanges.length; i++) {
            if (smartRange.mergeRange(mergedRanges[i])) {
                toRemoveIndices.push(i)
                console.log(`Merging with existing range: ${mergedRanges[i]}`)
            }
        }
        console.log(`Final merged range: ${smartRange.toString()}`)
        console.log(`Removing indices: ${toRemoveIndices}`)
        mergedRanges.splice(toRemoveIndices[0], toRemoveIndices.length)
        mergedRanges.push(smartRange.toString())
        mergedRanges.sort((r1, r2) => {
            const [minId1] = r1.split('-').map(id => Number(id))
            const [minId2] = r2.split('-').map(id => Number(id))
            return minId1 - minId2
        })

    }
    const totalSizeOfMergedRanges = mergedRanges.reduce((acc, range) => {
        const [minId, maxId] = range.split('-').map(id => Number(id))
        return acc + (maxId - minId + 1)
    }, 0)
    console.log(`Total fresh ingredients count: ${totalSizeOfMergedRanges}`)
}

part2()