import Midi from './midi.js'
import View from './view.js'

export default class Main {
    constructor() {
        this.midi = new Midi()
        this.view = new View()
    }
}
