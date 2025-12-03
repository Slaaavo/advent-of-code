import * as fs from 'fs'
import * as path from 'path'

function getJoltage(bank: string): number {
    const batteries = bank.split('').map(Number);
    const subBatteries = batteries.slice(0, -1);
    const sortedBatteries = subBatteries.toSorted((a, b) => b - a);
    const largestBattery = sortedBatteries[0] as number
    const largestIndex = batteries.indexOf(largestBattery);
    const batteriesAfterLargest = batteries.slice(largestIndex + 1);
    const sortedBatteriesAfterLargest = batteriesAfterLargest.toSorted((a, b) => b - a);
    const secondLargestBattery = sortedBatteriesAfterLargest[0];
    console.log(`Bank: ${bank}, Largest: ${largestBattery}, Second Largest: ${secondLargestBattery}`);  
    return Number(`${largestBattery}${secondLargestBattery}`);
}

function getJoltageGeneric(bank: string, numberOfBatteries: number): number {
    if (numberOfBatteries === 1) {
        return Math.max(...bank.split('').map(Number));
    }
    const batteries = bank.split('').map(Number);
    const subBatteries = batteries.slice(0, (numberOfBatteries - 1) * -1);
    const largestBattery = Math.max(...subBatteries);
    const largestIndex = batteries.indexOf(largestBattery);
    return getJoltageGeneric(batteries.slice(largestIndex + 1).join(''), numberOfBatteries - 1) + largestBattery * Math.pow(10, numberOfBatteries - 1);

}

function main() {

    const pathToThisFile = process.argv[1] as string
    const ext = path.extname(pathToThisFile)
    const inputPath = path.join(path.dirname(pathToThisFile), path.basename(pathToThisFile, ext) + ' input.txt')
    const banks = fs.readFileSync(inputPath, 'utf-8').split('\n').filter(line => line.length > 0)
    const totalJoltage = banks.reduce((acc, bank) => acc + getJoltageGeneric(bank, 12), 0)
    console.log(`Total joltage: ${totalJoltage}`)
}

main()