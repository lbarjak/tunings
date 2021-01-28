import Midi from './midi.js'

export default class Main {
    static instance = null

    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main()
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
