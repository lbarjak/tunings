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
        this.oscillators = []
        this.context = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)()
        /*         this.gain = this.context.createGain()
        this.gain.gain.value = 0.1
        this.gain.connect(this.context.destination) */
        //this.type = 'square'
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
        if (!this.oscillators[note]) {
            this.oscillators[note] = {}
            this.oscillators[note][channel] = false
        }
        if (!this.oscillators[note][channel]) {
            //sine, square, sawtooth, triangle, custom
            this.oscillators[note][channel] = this.context.createOscillator()
            //this.oscillators[note][channel].type = 'sine'
            this.oscillators[note][channel].type = 'square'
            this.oscillators[note][channel] = new adsr(
                this.context,
                0,
                2,
                0.3,
                0.3
            )
            if (channel == 0) {
                this.oscillators[note][
                    channel
                ].frequency.value = this.tuningEqual[note]
                this.gainL = this.context.createGain()
                this.gainL.gain.value = 0.1
                this.pannerL = this.context.createStereoPanner()
                this.pannerL.pan.value = -0.5
                this.oscillators[note][channel].connect(this.gainL)
                this.gainL.connect(this.pannerL)
                this.pannerL.connect(this.context.destination)

                console.log(
                    'equal',
                    note,
                    channel,
                    this.oscillators[note][channel].frequency.value + ' Hz'
                )
            }
            if (channel == 1) {
                this.oscillators[note][
                    channel
                ].frequency.value = this.tuningCircleOfFifth[note]
                this.gainR = this.context.createGain()
                this.gainR.gain.value = 0.1
                this.pannerR = this.context.createStereoPanner()
                this.pannerR.pan.value = 0.5
                this.oscillators[note][channel].connect(this.gainR)
                this.gainR.connect(this.pannerR)
                this.pannerR.connect(this.context.destination)
                console.log(
                    'fifth',
                    note,
                    channel,
                    this.oscillators[note][channel].frequency.value + ' Hz'
                )
            }
            this.oscillators[note][channel].start(this.context.currentTime)
        }
    }
    noteOff(note, channel) {
        if (channel > 1) {
            console.log('There is not a tunning on this channel!')
            return null
        }
        if (this.oscillators[note][channel]) {
            this.oscillators[note][channel].stop(this.context.currentTime)
            this.oscillators[note][channel] = false
        }
    }
}
