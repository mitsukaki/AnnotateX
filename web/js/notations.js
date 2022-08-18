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

    // seek to 5 seconds before the time
    player.seekTo((time - 5) > 0 ? time - 5 : 0);

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

// pause and play with space
let paused = false;
document.body.onkeyup = function (e) {
    // space bar to pause and play
    if (e.keyCode == 32) {
        if (paused) player.play();
        else player.pauseVideo();

        paused = !paused;
    }
    // enter key posts notation
    else if (e.keyCode == 13) {
        postNotation();
    }
}