import Synthesizer from './synthesizer.js'

export default class View {
    constructor() {
        this.checkboxes = []
        this.clicked = []
        this.synthesizer = Synthesizer.getInstance()
        this.notes = [
            'A',
            'A#',
            'B',
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#'
        ]
        this.write_fifths()
    }

    write_fifths() {
        let startnote = 57 //57 220 Hz, 69 440 Hz, 81 880 Hz
        for (let i = 0; i <= 36; i++) {
            fifths.innerHTML +=
                '<tr><th><input type="checkbox" name="checkbox' +
                i +
                '"></th><th>' +
                this.notes[(startnote - 9 + i) % 12] +
                ((startnote - 27 + i) / 12).toFixed(0) +
                '</th><th>' +
                this.synthesizer.tuningEqual[i + startnote].toFixed(4) +
                '</th><th>' +
                this.synthesizer.tuningCircleOfFifth[i + startnote].toFixed(4) +
                '</th><th>' +
                (
                    (100 *
                        (this.synthesizer.tuningCircleOfFifth[i + startnote] -
                            this.synthesizer.tuningEqual[i + startnote])) /
                    this.synthesizer.tuningEqual[i + startnote]
                ).toFixed(2) +
                ' %</th></tr>'
        }
        for (let i = 0; i <= 36; i++) {
            this.checkboxes[i] = document.querySelector(
                'input[name="checkbox' + i + '"]'
            )
            this.checkboxes[i].onclick = function () {
                if (
                    document.querySelector('input[name="checkbox' + i + '"]')
                        .checked
                ) {
                    console.log('btns[' + i + '] checked')
                    this.synthesizer.noteOn(i + startnote, 0)
                    this.synthesizer.noteOn(i + startnote, 1)
                } else {
                    console.log('btns[' + i + '] up')
                    this.synthesizer.noteOff(i + startnote, 0)
                    this.synthesizer.noteOff(i + startnote, 1)
                }
            }.bind(this)
        }
    }
}
