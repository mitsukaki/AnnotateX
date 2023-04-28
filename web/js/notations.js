// on document load
var ANNOTATIONS;
window.addEventListener('DOMContentLoaded', (event) => {
    // make REST request to get the anotations for this video ID
    let videoId = getPathItem(2);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/annotations/' + videoId, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            ANNOTATIONS = JSON.parse(xhr.responseText);
            renderAnotations(ANNOTATIONS);
        } else {
            // print the error
            console.log(xhr.statusText);

            // alert the user that there was an error
            alert('There was an error getting the annotations.');
        }
    };

    xhr.send();
});

function renderAnotations() {
    // get the anotation container
    let container = document.getElementById('notation-anchor');

    // empty the container
    container.innerHTML = '';

    // create a new div for each anotation
    for (let i = 0; i < ANNOTATIONS.length; i++) {
        // create note div
        let note = `
            <div class="notation" onClick="seekToNote(${ i })">
                <p class="timestamp">@${ getNoteTime(ANNOTATIONS[i].Time) }</p>
                <p class="note">${ ANNOTATIONS[i].Text }</p>
            </div>
        `;

        // add the note to the container
        container.innerHTML += note;
    }
}

function getNoteTime(time) {
    // convert time from float to integer
    time = Math.floor(time);

    // convert seconds to minutes and seconds
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // add leading zero to minutes and seconds
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${ minutes }:${ seconds }`;
}

function postNotation() {
    // get input text
    let text = document.getElementById('combo-text').value;

    // TODO: check if we want to rewind a bit

    // avoid blanks
    if (text.length == 0) return;

    // get the video id
    let videoId = getPathItem(2);

    // get the current time
    let time = player.getCurrentTime();

    // create the notation object
    let notation = {
        Time: time,
        Duration: 5,
        Text: text,
        Uuid: getUUID()
    };

    // make REST request to post the notation
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/annotations/' + videoId, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            // clear the input text
            document.getElementById('combo-text').value = '';

            // insert the notation into the array
            ANNOTATIONS.push(notation);

            // sort the array
            ANNOTATIONS.sort((a, b) => {
                return a.Time - b.Time
            });

            // render the anotations
            renderAnotations();

            // find the index of the annotation in the annotations array
            let index = ANNOTATIONS.findIndex(x => x.Uuid === notation.Uuid);

            // get the child of the notation anchor at that index
            let child = document.getElementById('notation-anchor').children[index];
            
            // scroll to the child
            child.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            // print the error
            console.log(xhr.statusText);

            // alert the user that there was an error
            alert('There was an error posting the notation.');
        }
    };

    xhr.send(JSON.stringify([notation]));
}

function seekToNote(index) {
    // get the time of the note
    let time = ANNOTATIONS[index].Time;

    // seek to the time
    player.seekTo(time);

    // play the video
    player.playVideo();

    // // scroll the note to the top
    // let child = document.getElementById('notation-anchor').children[index];
    // child.scrollIntoView({
    //     behavior: 'smooth'
    // });
}

function pauseVideo() {
    player.pauseVideo();
}

let isShiftDown = false;
document.body.onkeydown = function (e) {
    // if we hit shift
    if (e.keyCode == 16)
        isShiftDown = true;
}

document.body.onkeyup = function (e) {
    // if we let go of shift
    if (e.keyCode == 16) isShiftDown = false;

    // if we are typing
    if (document.activeElement.id == "combo-text") {
        // enter key posts notation
        if (e.keyCode == 13) {
            postNotation();

            // unfocus text
            document.getElementById("combo-text").blur();

            // resume the video
            player.playVideo();
        }
    }
    
    // we are watching video
    else {
        // if they hit space, toggle playback
        if (e.keyCode == 32) {
            if (player.getPlayerState() == 1) player.pauseVideo();
            else player.playVideo();
        }

        // if any key other than a special input
        else if (
            e.key.length == 1
        )
        {
            player.pauseVideo();

            // focus text box
            document.getElementById("combo-text").focus();

            // insert that character into the text box
            document.getElementById("combo-text").value += e.key;
        }

        // left key rewinds video by 5 seconds
        else if (e.keyCode == 37) {
            // get the current time
            let time = player.getCurrentTime();

            // rewind 5 seconds
            player.seekTo(time - 5);

            e.preventDefault();
        }

        // right key fast forwards video by 5 seconds
        else if (e.keyCode == 39) {
            // get the current time
            let time = player.getCurrentTime();

            // fast forward 5 seconds
            player.seekTo(time + 5);

            e.preventDefault();
        }

        // if shift is held down
        else if (e.shiftKey) {
            // down key slows the video down
            if (e.keyCode == 40) {
                // get the current playback rate
                let rate = player.getPlaybackRate();

                // slow down the video
                player.setPlaybackRate(rate - 0.25);

                e.preventDefault();
            }

            // up key speeds the video up
            else if (e.keyCode == 38) {
                // get the current playback rate
                let rate = player.getPlaybackRate();

                // speed up the video
                player.setPlaybackRate(rate + 0.25);

                e.preventDefault();
            }
        }
    }
}

// get the text box
let textBox = document.getElementById("combo-text");

// run function every second
setInterval(function () {
    // get the video time
    let time = player.getCurrentTime();
    if (time == 0) return;

    // set the textbox placeholder to the video time
    textBox.placeholder = "Leave note @" + getNoteTime(time) + " ...";
}, 1000);

window.addEventListener("selectstart", function (event) {
    if (!isShiftDown) event.preventDefault();
});