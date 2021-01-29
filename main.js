import Midi from './midi.js'
import Synthesizer from './synthesizer.js'

export default class Main {
    static instance = null

    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main()
            this.midi = new Midi()
        }
        return Main.instance
    }
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        this.synthesizer = new Synthesizer()
    }

    play(midiKey, midiChannel, midiVelocity) {
        this.synthesizer.noteOn(midiKey)
    }
    stop(midiKey, midiChannel) {
        this.synthesizer.noteOff(midiKey)
    }
    freq(midiChannel, midiKey) {
        return 440 * Math.pow(2, (midiKey - 69) / 12)
    }
}
