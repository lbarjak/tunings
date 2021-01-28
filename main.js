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
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        this.unlockAudioContext(this.audioCtx)
        this.oscillators = [[], []]
    }

    play(midiKey, midiChannel, midiVelocity) {
        this.oscillators[midiChannel][
            midiKey
        ] = this.audioCtx.createOscillator()
        this.oscillators[midiChannel][midiKey].type = 'sine'
        this.oscillators[midiChannel][midiKey].frequency.value = this.freq(
            midiChannel,
            midiKey
        )
        this.oscillators[midiChannel][midiKey].start(0)
        this.oscillators[midiChannel][midiKey].connect(
            this.audioCtx.destination
        )
    }
    stop(midiKey, midiChannel) {
        this.oscillators[midiChannel][midiKey].stop(0)
    }
    freq(midiChannel, midiKey) {
        return 440 * Math.pow(2, (midiKey - 69) / 12)
    }
    unlockAudioContext(audioCtx) {
        if (audioCtx.state !== 'suspended') return
        const b = document.body
        const events = ['touchstart', 'touchend', 'mousedown', 'keydown']
        events.forEach((e) => b.addEventListener(e, unlock, false))
        function unlock() {
            audioCtx.resume().then(clean)
        }
        function clean() {
            events.forEach((e) => b.removeEventListener(e, unlock))
        }
    }
}
