// on document load
window.addEventListener('DOMContentLoaded', (event) => {
    // make REST request to get the anotations for this video ID
    let videoId = getPathItem(2);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/annotations/' + videoId, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let annotations = JSON.parse(xhr.responseText);
            renderAnotations(annotations);
        } else {
            // print the error
            console.log(xhr.statusText);

            // alert the user that there was an error
            alert('There was an error getting the annotations.');
        }
    };

    xhr.send();
});

function renderAnotations(annotations) {
    // get the anotation container
    let container = document.getElementById('notations');

    // create a new div for each anotation
    for (let i = 0; i < annotations.length; i++) {
        // create note div
        let note = `
            <div class="notation">
                <p class="timestamp">@${ getNoteTime(annotations[i].Time) }</p>
                <p class="note">${ annotations[i].Text }</p>
            </div>
        `;

        // add the note to the container
        container.innerHTML += note;
    }
}

function getNoteTime(time) {
    // convert seconds to minutes and seconds
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // add leading zero to minutes and seconds
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${ minutes }:${ seconds }`;
}