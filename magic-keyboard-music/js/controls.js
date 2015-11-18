var synth = T("OscGen", {wave:"saw", mul:0.25}).play();


// var midicps = T("midicps");

var map = []

for (var i = 0; i < 256; i++) {
	map[i] = {pressed: false, held_length: 0};
}

document.onkeydown = function(event) {
    event = event || window.event;
    var e = event.keyCode;

    // only play once let go
	// held down
	map[e].held_length++;
	map[e].pressed = true;
	
    // space bar = clear
    if (e == 32) {

    }
	// console.log(map[e].held_length);
    
}
document.onkeyup = function(event) {
    event = event || window.event;
    var e = event.keyCode;



    var freq = getFrequency(midiDict(e, 60));
    var release_time = Math.min(400 + map[e].held_length * 40, 3000);
    // console.log(release_time);
    var tempsynth = T("saw", {freq:freq, mul:0.25});
    var env = T("perc", {r:release_time}, tempsynth).bang().play();
    // synth.def.env = env;

	// synth.noteOnWithFreq(freq, 100, env);

	spawnNote(world, release_time, keyDict(e));

	console.log(world.getBodies());

	// reset variables
    map[e].pressed = false;
    map[e].held_length = 0;
}


function getFrequency(midi_code) {
    var offset_code = midi_code - 69;
    if (offset_code > 0) {
        return Number(440 * Math.pow(2, offset_code / 12));
    } 
    else {
        return Number(440 / Math.pow(2, -offset_code / 12));
	}
}

function midiDict(keycode, offset) {
    var midi = offset;

    switch(keycode){
        //q 81 c3
        case 81:
            midi += 0;
            break;

        case 50:
            midi += 1;
            break;


        //w 87
        case 87:
            midi += 2;
            break;

        case 51:
            midi += 3;
            break;


        //e 69
        case 69:
            midi += 4;
            break;
        //r 82
        case 82:
            midi += 5;
            break;

        case 53:
            midi += 6;
            break;


        //t 84
        case 84:
            midi += 7;
            break;

        case 54:
            midi += 8;
            break;


        //y 89
        case 89:
            midi += 9;
            break;

        case 55:
            midi += 10;
            break;


        //u 85
        case 85:
            midi += 11;
            break;
        //i 73
        case 73:
            midi += 12;
            break;

        case 57:
            midi += 12;
            break;


        //o 79
        case 79:
            midi += 14;
            break;

        case 48:
            midi += 15;
            break;


        //p 80
        case 80:
            midi += 16;
            break;
        default:
            midi += 0;
            break
    }
    return midi;
}

function keyDict(keycode) {
    var x;

    // 10 is number of keys I'm using
    var tempwidth = width/10;

    switch(keycode){
        //q 81
        case 81:
            x = tempwidth;
            break;
        //w 87
        case 87:
            x = tempwidth*2;
            break;
        //e 69
        case 69:
            x = tempwidth*3;
            break;
        //r 82
        case 82:
            x = tempwidth*4;            
            break;
        //t 84
        case 84:
            x = tempwidth*5;
            break;
        //y 89
        case 89:
            x = tempwidth*6;
            break;
        //u 85
        case 85:
            x = tempwidth*7;
            break;
        //i 73
        case 73:
            x = tempwidth*8;
            break;
        //o 79
        case 79:
            x = tempwidth*9;
            break;
        //p 80
        case 80:
            x = tempwidth*10;
            break;
        default:
            x = width/2;
            break
    }
    return x;
}
