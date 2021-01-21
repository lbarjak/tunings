let start_note = 440;
let chromatic_step = Math.pow(2, 1 / 12);
let fifth_chromatic = Math.pow(chromatic_step, 7);
let fifth_natural = 1.5;
let fifths;
let notes_chromatic = [];
let notes_natural = [];

function start() {
  fifths = document.getElementById("fifths");
  //chromatic();
  //fifths.innerHTML += "-------";
  notes_chromatic = put_fifths(fifth_chromatic, notes_chromatic);
  notes_natural = put_fifths(fifth_natural, notes_natural);
  write_fifths();
}

function chromatic() {
  for (let i = 0; i <= 12; i++) {
    fifths.innerHTML +=
      "<div>" + (start_note * Math.pow(2, i / 12)).toFixed(2) + "</div>";
  }
}

function put_fifths(typeOfFifth, notes) {
  let actual_fifth;
  let local_start_note = start_note;
  notes = [];
  for (let i = 0; i <= 12; i++) {
    actual_fifth = local_start_note;
    while (actual_fifth > start_note * 2.1) {
      actual_fifth = actual_fifth / 2;
    }
    notes.push(actual_fifth.toFixed(2));
    local_start_note = local_start_note * typeOfFifth;
  }
  notes.sort();
  return notes;
}

function write_fifths() {
  for (let i = 0; i <= 12; i++) {
    fifths.innerHTML +=
      '<div><input type="button" name="button" value=">"> ' +
      notes_chromatic[i] +
      " - " +
      notes_natural[i] + " | " + (100 * (notes_natural[i] - notes_chromatic[i]) / notes_chromatic[i]).toFixed(2) +
      " %</div>";
  }
}
