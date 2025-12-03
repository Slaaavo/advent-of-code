import * as fs from 'fs'
import * as path from 'path'

class Safe {
    dial = 50
    zeroCounter = 0
    maxNumber = 100
    count0clicks = true
    passedZeroTimes = 0

    turnDialLeft(number: number) {
        this.passedZeroTimes = 0
        for (let i = 0; i < number; i++) {
            if (this.dial === 0) {
                this.dial = this.maxNumber - 1
            } else {
                this.dial -= 1
            }
            if (this.count0clicks && this.dial === 0) {
                this.passedZeroTimes += 1
            }
        }
        this.zeroCounter += this.passedZeroTimes
        // if (this.count0clicks) {
        //     this.passedZeroTimes = Math.abs(Math.floor((this.dial - number) / this.maxNumber))
        //     this.zeroCounter += this.passedZeroTimes
        // }
        // const diff = this.dial - number
        // if (diff > 0) {
        //     this.dial = diff
        //     return
        // } else if (diff === 0) {
        //     if (this.count0clicks) {
        //         this.passedZeroTimes = 1
        //         this.zeroCounter += this.passedZeroTimes
        //     }
        //     this.dial = 0
        //     return
        // }
        // if (this.count0clicks) {
        //     this.passedZeroTimes = this.dial === 0 ? 0 : 1
        //     this.passedZeroTimes += Math.floor(Math.abs(diff) / this.maxNumber)
        //     this.zeroCounter += this.passedZeroTimes
        // }
        // this.dial = this.maxNumber - (Math.abs(diff) % this.maxNumber)
    }

    turnDialRight(number: number) {
        if (this.count0clicks) {
            this.passedZeroTimes = Math.floor((this.dial + number) / this.maxNumber)
            this.zeroCounter += this.passedZeroTimes
        }

        this.dial = (this.dial + number) % this.maxNumber
    }

    turnDial(instruction: string) {
        const direction = instruction.slice(0, 1)
        const number = parseInt(instruction.slice(1))

        if (direction === 'L') {
            this.turnDialLeft(number)
        } else if (direction === 'R') {
            this.turnDialRight(number)
        }
        if (this.dial === 0 && !this.count0clicks) {
            this.zeroCounter += 1
        }
        console.log(`Turned ${instruction}, dial is now at ${this.dial}, passed zero times: ${this.passedZeroTimes}`)
        this.passedZeroTimes = 0
    }
}

function main() {
    const pathToThisFile = process.argv[1]
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const instructions = fs.readFileSync(inputPath, 'utf-8').split('\n').filter(line => line.length > 0)
    const safe = new Safe()

    instructions.forEach(instruction => {
        safe.turnDial(instruction)
    })
    console.log(`Final dial position: ${safe.dial}`)
    console.log(`Number of times dial was at 0: ${safe.zeroCounter}`)
}

main()