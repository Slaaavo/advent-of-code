import * as fs from 'fs'
import * as path from 'path'

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const points = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const maxArea = points.reduce((maxArea, point, i) => {
        const [x1, y1] = point.split(',').map(s => s.trim())
        return Math.max(maxArea, points.slice(i + 1).reduce((maxArea, otherPoint) => {
            const [x2, y2] = otherPoint.split(',').map(s => s.trim())
            const area = Math.abs(parseInt(x1) - parseInt(x2) + 1) * Math.abs(parseInt(y1) - parseInt(y2) + 1)
            return Math.max(maxArea, area)
        }, 0))
    }, 0)
    console.log(`Max area: ${maxArea}`)

}

function createPointsAlongLine(point1: number[], point2: number[]): number[][] {
    const points: number[][] = []
    const [x1, y1] = point1
    const [x2, y2] = point2
    points.push([x1, y1])
    if (x1 === x2) {
        let i = y1 < y2 ? y1 + 1 : y1 - 1
        while (i !== y2) {
            points.push([x1, i])
            i = y1 < y2 ? i + 1 : i - 1
        }
    } else if (y1 === y2) {
        let i = x1 < x2 ? x1 + 1 : x1 - 1
        while (i !== x2) {
            points.push([i, y1])
            i = x1 < x2 ? i + 1 : i - 1
        }
    }
    return points
}

function isWithinPolygon(point: number[], polygon: number[][], pointsCache: Map<string, boolean>): boolean {
    const cachedValue = pointsCache.get(point.join(','))
    if (cachedValue !== undefined) {
        return cachedValue
    }
    let xPointsRight = []
    let xPointsLeft = []
    let yPointsAbove = []
    let yPointsBelow = []
    for (const polyPoint of polygon) {
        if (polyPoint[0] === point[0]) {
            if (polyPoint[1] > point[1]) {
                yPointsAbove.push(polyPoint[1])
            } else if (polyPoint[1] < point[1]) {
                yPointsBelow.push(polyPoint[1])
            }
        } else if (polyPoint[1] === point[1]) {
            if (polyPoint[0] > point[0]) {
                xPointsRight.push(polyPoint[0])
            } else if (polyPoint[0] < point[0]) {
                xPointsLeft.push(polyPoint[0])
            }
        }
    }
    const result = xPointsRight.length % 2 === 1 && xPointsLeft.length % 2 === 1 && yPointsAbove.length % 2 === 1 && yPointsBelow.length % 2 === 1
    pointsCache.set(point.join(','), result)
    return result
}

function buildRectanglePoints(point1: number[], point2: number[]): number[][] {
    const points: number[][] = []
    const [x1, y1] = point1
    const [x2, y2] = point2
    const point3 = [x1, y2]
    const point4 = [x2, y1]
    points.push(...createPointsAlongLine(point1, point3))
    points.push(...createPointsAlongLine(point3, point2))
    points.push(...createPointsAlongLine(point2, point4))
    points.push(...createPointsAlongLine(point4, point1))
    return points
}

function part2() {
    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const points = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const pointsCache = new Map<string, boolean>()
    // build the whole polygon
    const polygon: number[][] = []
    for (let i = 0; i < points.length - 1; i++) {
        console.log('Processing edge:', points[i], 'to', points[i + 1])
        const point1 = points[i].split(',').map(s => parseInt(s.trim()))
        const point2 = points[i + 1].split(',').map(s => parseInt(s.trim()))
        const linePoints = createPointsAlongLine(point1, point2)
        polygon.push(...linePoints)
        for (const p of linePoints) {
            pointsCache.set(p.join(','), true)
        }
    }
    const maxArea = points.reduce((maxArea, point, i) => {
        const [x1, y1] = point.split(',').map(s => parseInt(s.trim()))
        return Math.max(maxArea, points.slice(i + 1).reduce((maxArea, otherPoint) => {
            const [x2, y2] = otherPoint.split(',').map(s => parseInt(s.trim()))
            const rectanglePoints = buildRectanglePoints([x1, y1], [x2, y2])
            console.log('Checking rectangle:', [x1, y1], [x2, y2])
            const isRectangleWithinPolygon = rectanglePoints.every(p => isWithinPolygon(p, polygon, pointsCache))
            if (!isRectangleWithinPolygon) {
                return maxArea
            }
            const area = Math.abs(x1 - x2 + 1) * Math.abs(y1 - y2 + 1)
            return Math.max(maxArea, area)
        }, 0))
    }, 0)
    console.log(`Max area: ${maxArea}`)
}

part2()