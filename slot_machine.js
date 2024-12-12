// slot machine
import prompt from "prompt-sync"


class SlotMachine {

    constructor() {
        this.prompt = prompt()
        this._depositA = -1
        this._linesA = -1

        this._createMachine()
    }

    _createMachine = () => {
        this.rows = 3
        this.columns = 3

        this._restoreSymbolsCount()

        this.symbolValues = {
            // If get A then multiply per value
            "A": 5,
            "B": 4,
            "C": 3,
            "D": 2,
        }
    }


    _restoreSymbolsCount = () => {
        this.symbolsCount = {
            "A": 2,
            "B": 4,
            "C": 6,
            "D": 9,
        }
    }


    _randomize = (max, min) => {
        return Math.random() * (max - min);
    }

    _spin = () => {
        this._restoreSymbolsCount()
        this.matrix = []
        let row = []
        const keys = Object.keys(this.symbolsCount)
        while (!(this.matrix.length === this.columns)) {
            let currentKey = keys[Math.floor(this._randomize(4, 0))]
            if (this.symbolsCount[currentKey] === 0) {
                continue
            }
            row.push(currentKey)
            this.symbolsCount[currentKey] -= 1
            if (row.length === this.rows) {
                this.matrix.push(row)
                row = []
            }
        }
        this._printMatrix()
        this._checkIfWinner()
    }

    _printMatrix = () => {
        console.log("Rollinggggg......")
        for (let i = 0; i < this.rows; i++) {
            let row = ' '
            for (let j = 0; j < this.columns; j++) {
                if (j + 1 === this.columns) {
                    row += this.matrix[i][j]

                } else {
                    row += this.matrix[i][j] + ' | '
                }
            }
            console.info(row)
        }
    }

    _checkIfWinner = () => {
        let straightLines = 0
        let victoryAmount = 0
        for (let i = 0; i < this.rows; i++) {
            let lineWins = 0
            for (let j = 0; j < this.columns + 1; j++) {
                if (this.matrix[i][j] === this.matrix[i][j + 1]) {
                    lineWins += 1
                }
            }
            if (lineWins === this.columns) {
                straightLines += 1
                victoryAmount += this._betAm * this.symbolValues[this.matrix[i][0]]
                // console.log("victoryAmount: ", victoryAmount)
            }
        }
        // console.log("Straight lines won: ", straightLines, ",money got: ", victoryAmount)
        this._depositA += victoryAmount
        console.log("YOU WON: ", victoryAmount)
        console.log("new balance: ", this._depositA)
    }

    _parseInput = (input, allowFloat) => {
        let amount
        if (allowFloat) {
            amount = parseFloat(input)
        } else {
            amount = parseInt(input)
        }
        return amount
    }


    _promptInterface = (promptString, retryString, successString, lowLimit, highLimit, allowFloat) => {
        let res = this.prompt(promptString)
        let amountAsInt = this._parseInput(res, allowFloat)
        while (isNaN(amountAsInt) || amountAsInt <= lowLimit || amountAsInt >= highLimit) {
            console.log(retryString)
            res = this.prompt(promptString)
            amountAsInt = this._parseInput(res, allowFloat)
        }
        console.log(successString, res)
        return amountAsInt
    }
    _deposit = () => {
        this._depositA = this._promptInterface("input amount of money: ",
            "Please input correct amount of money in numbers, and not some bullshit you typed probably",
            "entered: amount", 0, 9999999999, true)
    }
    _numOfBetLines = () => {
        this._linesA = this._promptInterface("how many lines you wanna bet on? ",
            "Please input correct amount of lines, dont be a tard its easy, its 1-3",
            "entered: lines", 0, 4, false)
    }

    _betAmount = () => {
        this._betAm = this._promptInterface("how much money you wanna bet on one line? ",
            "again with the retardation, you dont have this money or you input some shit as always",
            "bet on: amount", 0, (this._depositA + 0.01) / this._linesA, true)

    }

    _rebet = () => {
        this._deposit()
        this._numOfBetLines()
        this._betAmount()
    }

    letsRoll = () => {
        this._rebet()
        while (this.prompt("ROLL??? (y/n)") === 'y') {
            this._depositA -= this._betAm
            if (this._depositA === 0 || this._depositA < 0) {
                console.log("you out of money bitch")
                this._rebet()
            }
            this._spin()
        }
        console.log("BYE BYE, take your shitty %d$", this._depositA)
    }
}


const machine = new SlotMachine()
machine.letsRoll()

