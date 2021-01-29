//based on https://github.com/uber5001/CanvasKeyboard
'use strict'

import adsr from './adsr.js'

export default class Synthesizer {
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
        this.tuningEqual = []
        this.tuningEqualF()
    }
    tuningEqualF() {
/*         for (let i = 0; i <= 128; i++) {
            this.tuningEqual[i] = 440 * Math.pow(2, (i - 69) / 12)
            console.log("note " + i + " freq " + this.tuningEqual[i] + " Hz")
        } */
        for (let i = 117; i <= 128; i++) {
            this.tuningEqual[i] = 440 * Math.pow(2, (i - 69) / 12)
        }
        for (let i = 128; i > 11; i--) {
            this.tuningEqual[i - 12] = this.tuningEqual[i] / 2
        }
        for (let i = 0; i <= 128; i++) {
            console.log("note " + i + " freq " + this.tuningEqual[i] + " Hz")
        }
    }
    noteOn(note, channel) {
        if (!this.channels[note]) {
            this.channels[note] = {}
            this.channels[note][channel] = false
        }
        if (!this.channels[note][channel]) {
            /*             this.channels[note][channel] = this.context.createOscillator();
            this.channels[note][channel].type = 'sine' */
            this.channels[note][channel] = new adsr(
                this.context,
                0,
                2,
                0.3,
                0.3
            )
/*             this.channels[note][channel].frequency.value =
                440 * Math.pow(2, (note - 69) / 12) */
            console.log(this.tuningEqual[note])
            this.channels[note][channel].frequency.value = this.tuningEqual[note]
            console.log(this.channels[note][channel].frequency.value + ' Hz')
            this.channels[note][channel].type = this.type
            this.channels[note][channel].connect(this.gain)
            this.channels[note][channel].start(this.context.currentTime)
        }
    }
    noteOff(note, channel) {
        this.channels[note][channel].stop(this.context.currentTime)
        this.channels[note][channel] = false
    }
}
