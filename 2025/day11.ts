import * as fs from 'fs'
import * as path from 'path'

function exploreConnections(graph: Map<string, string[]>, startNode: string, visited = new Set<string>(), criticalNodes?: string[], passedCriticalNodes = new Set<string>()): number {
    const connectedNodes = graph.get(startNode) || []
    let total = 0
    for (const node of connectedNodes) {
        if (node === 'out') {
            return !criticalNodes?.length ? 1 : passedCriticalNodes.size === criticalNodes.length ? 1 : 0
        } 
        if (!visited.has(node)) {
            visited.add(node)
            if (criticalNodes?.includes(node)) passedCriticalNodes.add(node)
            total += exploreConnections(graph, node, new Set(visited), criticalNodes, new Set(passedCriticalNodes))
        } 
    }
    return total
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const graph = new Map<string, string[]>()
    fs.readFileSync(inputPath, 'utf-8').split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .forEach(line => {
            const [node, connections] = line.split(':')
            const connectedNodes = connections.trim().split(' ')
            graph.set(node, connectedNodes)
        })
    const totalConnections = exploreConnections(graph, 'you')
    console.log(`Total connections from 'you' to 'out': ${totalConnections}`)
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const graph = new Map<string, string[]>()
    fs.readFileSync(inputPath, 'utf-8').split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .forEach(line => {
            const [node, connections] = line.split(':')
            const connectedNodes = connections.trim().split(' ')
            graph.set(node, connectedNodes)
        })
    const totalConnections = exploreConnections(graph, 'svr', new Set<string>(['svr']), ['fft', 'dac'])
    console.log(`Total connections from 'svr' to 'out': ${totalConnections}`)
}

part2()