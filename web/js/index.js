function create() {
    // get the combo-text value
    var comboText = document.getElementById("combo-text").value;

    // get the v parameter from the comboText url using regex
    var videoId = comboText.match(/v=([^&]*)/)[1];
    // check if we failed to parse the video id with the split
    if (videoId == null) {
        // try matching with a different regex
        let matches = comboText.match(/[?&]v=([^&]+)/);
        videoId = matches[1];

        // if videoId is still null, then the url is invalid
        if (videoId == null) {
            alert("Invalid url");
            return;
        }
    }

    // make REST request to post a blank notation
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/annotations/' + videoId, true);
    xhr.onload = function () {
        // if there was an error, alert the user
        if (xhr.status !== 200) {
            alert("There was an error creating the annotation.");
            return;
        }

        // redirect to the video page
        window.location.href = "/y/" + videoId;
    };

    // send json data
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send("{}");
}