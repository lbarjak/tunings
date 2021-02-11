export default class Tunings {
    constructor() {
        this.tuningEqual = new Array(129).fill(0)
        this.tuningCircleOfFifth = new Array(129).fill(0)
    }

    tuningEqualF() {
        //117 A8 7040.00 (7040 / 2^4 = 440)
        for (let i = 117; i <= 128; i++) {
            this.tuningEqual[i] = 440 * Math.pow(2, (i - 69) / 12)
        }
        for (let i = 128; i > 11; i--) {
            this.tuningEqual[i - 12] = this.tuningEqual[i] / 2
        }
    }
    tuningCircleOfFifthF() {
        let startNote = 8343.703703703702
        let localStartNote = startNote
        let naturalFifth = 1.5
        let actualFifth
        for (let i = 120; i <= 131; i++) {
            actualFifth = localStartNote
            while (actualFifth > startNote * 2.1) {
                actualFifth = actualFifth / 2
            }
            this.tuningCircleOfFifth[i] = actualFifth
            localStartNote = localStartNote * naturalFifth
        }
        this.tuningCircleOfFifth.sort((a, b) => a - b)
        for (let i = 131; i > 11; i--) {
            this.tuningCircleOfFifth[i - 12] = this.tuningCircleOfFifth[i] / 2
        }
    }
}
