import * as fs from 'fs'
import * as path from 'path'

function toggleButton(lights: string, button: number[]): string {
    const newLights = lights.split('')
    for (const pos of button) {
        newLights[pos] = newLights[pos] === '.' ? '#' : '.'
    }
    return newLights.join('')
}

function turnMachineOn(machine: string): number {
    const lights = machine.match(/\[.+\]/g)![0].slice(1, -1)
    const lightsStates = new Map<string, number>([['.'.repeat(lights.length), 0]])
    const buttons = Array.from(machine.matchAll(/\((.+?)\)/g)).map(btn => btn[1].split(',').map(num => parseInt(num)))
    let counter = 1
    while (true) {
        const lightsAtCounter = Array.from(lightsStates.entries()).filter(([_, step]) => step === counter - 1)
        for (const [currentLights, _] of lightsAtCounter) {
            for (const button of buttons) {
              const newLights = toggleButton(currentLights, button)
                if (newLights === lights) return counter
                if (!lightsStates.has(newLights)) {
                    lightsStates.set(newLights, counter)
                }
            }
        }
        counter++
    }
}

function part1() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const machines = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const total = machines.reduce((sum, machine) => {
        return sum + turnMachineOn(machine)
    }, 0)
    console.log(`Total steps to turn on all machines: ${total}`)
}

function maxButtonPresses(currentCounters: string, targetCounters: string, button: number[]): {presses: number, newCounters: string} {
    const currentCountersArr = currentCounters.split(',').map(num => parseInt(num))
    const targetCountersArr = targetCounters.split(',').map(num => parseInt(num))
    const presses = Math.min(...button.map(pos => targetCountersArr[pos] - currentCountersArr[pos]))
    for (const pos of button) {
        currentCountersArr[pos] += presses
    }
    return {presses, newCounters: currentCountersArr.join(',')}
}

function turnMachineOn2(machine: string): number {
    const counters = machine.match(/\{.+\}/g)![0].slice(1, -1)
    const countersNumbers = counters.split(',').map(num => parseInt(num))
    const buttons = Array.from(machine.matchAll(/\((.+?)\)/g)).map(btn => btn[1].split(',').map(num => parseInt(num)))
    let totalPresses = 0
    let availableButtons = buttons.slice()
    let currentCounters = '0'.repeat(countersNumbers.length).split('').join(',')
    const stack: {button: number[], presses: number, newCounters: string, currentTotalPresses: number}[] = []

    while (stack.length > 0) {
        const sortedButtons = availableButtons.map(b => ({button: b, ...maxButtonPresses(currentCounters, counters, b), currentTotalPresses: totalPresses})).sort((a, b) => b.presses - a.presses)
        const minPresses = sortedButtons[0].presses
        stack.push(...sortedButtons.filter(b => b.presses === minPresses))
        const {button, presses, newCounters, currentTotalPresses} = stack.pop()!
        totalPresses = currentTotalPresses + presses
        currentCounters = newCounters
        const currentCountersArr = currentCounters.split(',').map(num => parseInt(num))
        const newCountersArr = counters.split(',').map(num => parseInt(num))
        availableButtons = availableButtons.filter(btn => !btn.some(pos => currentCountersArr[pos] === newCountersArr[pos]))
    }
    console.log(`Machine ${machine} turned on in ${totalPresses} presses`)
    return totalPresses
}

function part2() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const machines = fs.readFileSync(inputPath, 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const total = machines.reduce((sum, machine) => {
        return sum + turnMachineOn2(machine)
    }, 0)
    console.log(`Total steps to turn on all machines: ${total}`)
}

part2()