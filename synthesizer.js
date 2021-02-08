//based on https://github.com/uber5001/CanvasKeyboard

import adsr from './adsr.js'

export default class Synthesizer {
    static instance = null
    //singleton factory
    static getInstance() {
        if (!Synthesizer.instance) {
            Synthesizer.instance = new Synthesizer()
        }
        return Synthesizer.instance
    }
    constructor() {
        this.channels = []
        this.context = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)()
        const destination = this.context.destination
        this.gain = this.context.createGain()
        this.gain.gain.value = 0.1
        this.gain.connect(this.context.destination)
        this.type = 'square'
        this.context.resume()
        this.tuningEqual = new Array(129).fill(0)
        this.tuningEqualF()
        this.tuningCircleOfFifth = new Array(129).fill(0)
        this.tuningCircleOfFifthF()
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
    noteOn(note, channel) {
        if (channel > 1) {
            console.log('There is not a tunning on this channel!')
            return null
        }
        if (!this.channels[note]) {
            this.channels[note] = {}
            this.channels[note][channel] = false
        }
        if (!this.channels[note][channel]) {
            //sine, square, sawtooth, triangle, custom
            /* this.channels[note][channel] = this.context.createOscillator();
            this.channels[note][channel].type = 'sine' */
            this.channels[note][channel] = new adsr(
                this.context,
                0,
                2,
                0.3,
                0.3
            )
            if (channel == 0) {
                this.channels[note][channel].frequency.value = this.tuningEqual[
                    note
                ]
                console.log(
                    'equal',
                    note,
                    channel,
                    this.channels[note][channel].frequency.value + ' Hz'
                )
            }
            if (channel == 1) {
                this.channels[note][
                    channel
                ].frequency.value = this.tuningCircleOfFifth[note]
                console.log(
                    'fifth',
                    note,
                    channel,
                    this.channels[note][channel].frequency.value + ' Hz'
                )
            }
            this.channels[note][channel].type = this.type
            this.channels[note][channel].connect(this.gain)
            this.channels[note][channel].start(this.context.currentTime)
        }
    }
    noteOff(note, channel) {
        if (channel > 1) {
            console.log('There is not a tunning on this channel!')
            return null
        }
        if (this.channels[note][channel]) {
            this.channels[note][channel].stop(this.context.currentTime)
            this.channels[note][channel] = false
        }
    }
}
