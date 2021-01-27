import Midi from './midi.js'

export default class Main {
    static instance = null

    constructor() {
        if (!Main.instance) {
            Main.instance = this
            this.midi = new Midi()
        }
        return Main.instance
    }

    play(midiKey, midiChannel, midiVelocity) {
        console.log('play', midiChannel)
    }
    stop(midiKey, midiChannel) {
        console.log('stop', midiChannel)
    }
}
