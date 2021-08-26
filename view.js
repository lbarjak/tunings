import Synthesizer from './synthesizer.js'

export default class View {
    constructor() {
        this.synthesizer = Synthesizer.getInstance()
        this.checkboxes = []
        this.startnote
        this.writeFifths()
        this.checkFifths()
    }

    writeFifths() {
        this.startnote = 57 //57 220 Hz, 69 440 Hz, 81 880 Hz
        let notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
        for (let i = 0; i <= 36; i++) {
            fifths.innerHTML +=
                '<tr><th><input type="checkbox" name="checkbox' +
                i +
                '"></th><th>' +
                notes[(this.startnote - 9 + i) % 12] +
                ((this.startnote - 27 + i) / 12).toFixed(0) +
                '</th><th>' +
                this.synthesizer.tuningEqual[i + this.startnote].toFixed(2) +
                '</th><th>' +
                this.synthesizer.tuningCircleOfFifth[i + this.startnote].toFixed(2) +
                '</th><th>' +
                (
                    (100 *
                        (this.synthesizer.tuningCircleOfFifth[i + this.startnote] -
                            this.synthesizer.tuningEqual[i + this.startnote])) /
                    this.synthesizer.tuningEqual[i + this.startnote]
                ).toFixed(2) +
                ' %</th></tr>'
        }
    }
    checkFifths() {
        for (let i = 0; i <= 36; i++) {
            this.checkboxes[i] = document.querySelector('input[name="checkbox' + i + '"]')
            this.checkboxes[i].onclick = function () {
                if (document.querySelector('input[name="checkbox' + i + '"]').checked) {
                    console.log('btns[' + i + '] checked')
                    if (document.querySelector('input[name="all0"]').checked)
                        this.synthesizer.noteOn(i + this.startnote, 0)
                    if (document.querySelector('input[name="all1"]').checked)
                        this.synthesizer.noteOn(i + this.startnote, 1)
                } else {
                    console.log('btns[' + i + '] up')
                    this.synthesizer.noteOff(i + this.startnote, 0)
                    this.synthesizer.noteOff(i + this.startnote, 1)
                }
            }.bind(this)
        }
        let allOff = document.querySelector('input[name="allOff"]')
        allOff.onclick = function () {
            if (allOff.checked) {
                for (let i = 0; i <= 36; i++) {
                    if (document.querySelector('input[name="checkbox' + i + '"]').checked) {
                        document.querySelector('input[name="checkbox' + i + '"]').checked = false
                        this.synthesizer.noteOff(i + this.startnote, 0)
                        this.synthesizer.noteOff(i + this.startnote, 1)
                    }
                }
                setTimeout(() => {
                    allOff.checked = false
                }, 300)
            }
        }.bind(this)
    }
}
