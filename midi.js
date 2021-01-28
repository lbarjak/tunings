import Main from './main.js'

export default class Midi {
    constructor() {
        navigator.requestMIDIAccess().then(this.midi)
        self = this
        this.main = Main.getInstance()
    }

    midi(response) {
        for (let inputPort of response.inputs.values()) {
            console.log(
                'input ports:',
                inputPort.type,
                inputPort.name,
                inputPort.state
            )
            connect(inputPort)
        }

        response.onstatechange = midiOnStateChange

        function midiOnStateChange(event) {
            if (
                event.port.type == 'input' &&
                event.port.state == 'connected' &&
                !event.port.onmidimessage
            ) {
                connect(event.port)
            }
        }

        function connect(port) {
            port.onmidimessage = midiMessage
        }
        let midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity
        function midiMessage(event) {
            midiStatusByte = event.data[0].toString(16)
            midiEvent = midiStatusByte.substring(0, 1)
            midiChannel = midiStatusByte.substring(1)
            midiKey = event.data[1]
            midiVelocity = event.data[2]
            console.log(
                event.currentTarget.name,
                '-',
                'midiEvent:',
                midiEvent,
                ' midiChannel:',
                midiChannel,
                ' midiKey:',
                midiKey,
                'midiVelocití',
                midiVelocity
            )
            if (midiEvent == '9') {
                console.log('9')
                self.main.play(midiKey, midiChannel, midiVelocity)
            } else {
                console.log('8')
                self.main.stop(midiKey, midiChannel)
            }
        }
    }
}
