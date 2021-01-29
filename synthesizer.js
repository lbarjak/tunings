//based on https://github.com/uber5001/CanvasKeyboard
"use strict";

import adsr from './adsr.js';

export default class Synthesizer {
    constructor() {
        this.channels = [];
        this.context = new (
            window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext
        )
        const destination = this.context.destination;
        this.gain = this.context.createGain();
        this.gain.gain.value = .1;
        this.gain.connect(this.context.destination);
        this.type = "square";
        this.context.resume();
    }
    noteOn(note) {
        if (this.channels[note])
            return;
        this.channels[note] = new adsr(this.context, 0, 2, .3, .3);
        this.channels[note].frequency.value = 440 * Math.pow(2, (note - 57) / 12);
        this.channels[note].type = this.type;
        this.channels[note].connect(this.gain);
        this.channels[note].start(this.context.currentTime);
    }
    noteOff(note) {
        this.channels[note].stop(this.context.currentTime);
        this.channels[note] = false;
    }
}