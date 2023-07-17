const audioContext = new AudioContext() //added with real audio on line 55

const NOTE_DETAILS = [
    { note: "C", key: "Z", frequency: 261.626 },
    { note: "Db", key: "S", frequency: 277.183 },
    { note: "D", key: "X", frequency: 293.665 },
    { note: "Eb", key: "D", frequency: 311.127 },
    { note: "E", key: "C", frequency: 329.628 },
    { note: "F", key: "V", frequency: 349.228 },
    { note: "Gb", key: "G", frequency: 369.994 },
    { note: "G", key: "B", frequency: 391.995 },
    { note: "Ab", key: "H", frequency: 415.305 },
    { note: "A", key: "N", frequency: 440 },
    { note: "Bb", key: "J", frequency: 466.164 },
    { note: "B", key: "M", frequency: 493.883 },
]

document.addEventListener("keydown", (e) => {
    if (e.repeat) return // guard close - he will skip code after once been called
    // console.log('down')
    // console.log(e)//you see inside event object exist repeat property,
    // //if you hold button it will repeat call again and again, add if guard close
    const keyboardKey = e.code
    const noteDetail = getNoteDetail(keyboardKey)
    // console.log(noteDetail)//if not exist we add code down and skip code after
    if (noteDetail == null) return
    noteDetail.active = true //add to NOTE_DETAILS active sound
    playNotes() // calling function to add sound
})

document.addEventListener("keyup", (e) => {
    // console.log('up')
    // console.log(e)
    const keyboardKey = e.code
    const noteDetail = getNoteDetail(keyboardKey)
    if (noteDetail == null) return
    noteDetail.active = false //add to NOTE_DETAILS deactivate sound
    playNotes()
})

function getNoteDetail(keyboardKey) {
    return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey) //keyboardKey is property of keyboard event
}

function playNotes() {
    // console.log('play notes')
    NOTE_DETAILS.forEach((n) => {
        const keyElement = document.querySelector(`[data-note="${n.note}"]`)
        // console.log(keyElement)
        keyElement.classList.toggle("active", n.active || false) //without false it will select all,
        //adding to NOTE_DETAILS for every note "active:false" will gave same result
        if (n.oscillator != null) {
            n.oscillator.stop() //stop sound
            n.oscillator.disconnect() //disconnect rest to oscillator
        }
    })
    //part where we adding actual audio, including new Audio on first line of the entirely code
    const activeNotes = NOTE_DETAILS.filter((n) => n.active)
    const gain = 1 / activeNotes.length//this will split sound strength to always bee 100% together
    activeNotes.forEach((n) => {
        startNote(n, gain)
    })
}

function startNote(noteDetail, gain) {
    const gainNode = audioContext.createGain()
    gainNode.gain.value = gain//add value to gain
    const oscillator = audioContext.createOscillator()
    oscillator.frequency.value = noteDetail.frequency//value take frequency from code
    oscillator.type = "sine" // savtooth will gave another sound
    oscillator.connect(gainNode).connect(audioContext.destination) //destination is speaker//gainNode add last
    oscillator.start() //start sound
    noteDetail.oscillator = oscillator //this add oscillator to the global var noteDetail
}
