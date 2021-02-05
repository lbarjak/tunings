import Midi from './midi.js'
import Synthesizer from './synthesizer.js'
import View from './view.js'

export default class Main {
    static instance = null
    //singleton factory
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
        this.view = new View(this.synthesizer)
    }

    play(midiKey, midiChannel, midiVelocity) {
        this.synthesizer.noteOn(midiKey, midiChannel)
    }
    stop(midiKey, midiChannel) {
        this.synthesizer.noteOff(midiKey, midiChannel)
    }
}
