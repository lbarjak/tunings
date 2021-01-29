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
            this.channels[note][channel].frequency.value =
                440 * Math.pow(2, (note - 69) / 12)
            console.log(this.channels[note][channel].frequency.value + " Hz")
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
