// on document load
window.addEventListener('DOMContentLoaded', (event) => {
    // make REST request to get the anotations for this video ID
    var videoId = getPathItem(2);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/annotations/' + videoId, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var annotations = JSON.parse(xhr.responseText);
            console.log(annotations);
        } else {
            // error
            console.log("failed!");
        }
    };

    xhr.send();
});