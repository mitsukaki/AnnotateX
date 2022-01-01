function create() {
    // get the combo-text value
    var comboText = document.getElementById("combo-text").value;

    // parse the youtube url for the video ID
    var matches = comboText.match(/[?&]v=([^&]+)/);

    // if there are no matches, return
    if (matches === null) {
        // alert the user
        alert("Invalid YouTube URL");
        return;
    }
    
    var videoId = matches[1];
    // check if the video ID is valid
    if (videoId) {
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
            window.location.href = "/n/" + videoId;
        };

        xhr.send("{}");

    } else {
        // alert the user that the video link is invalid
        alert("Invalid video link");
    }
}