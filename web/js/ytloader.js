// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Create an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: getPathItem(2),
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// call back function for player ready event
function onPlayerReady(event) {
    // update the page title
    document.title = 'Annotatex | ' + event.target.getVideoData().title;

    // get the video dimensions
    getVideoDimensions(getPathItem(2));
}

var vidAspectRatio = 1;
function getVideoDimensions(videoID) {
    // xhr request to get the video dimensions
    let xhr = new XMLHttpRequest();
    
    // open the request
    xhr.open('GET', 'https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + videoID + '&format=json', true);

    // set the onload callback
    xhr.onload = function () {
        // if there was an error, alert the user
        if (xhr.status !== 200) {
            alert("There was an error getting the video dimensions.");
            return;
        }

        // parse the response
        let response = JSON.parse(xhr.responseText);

        // compute the aspect ratio
        vidAspectRatio = response.height/ response.width;

        // apply the aspect ratio
        applyAspectRatio();
    };

    // send the request
    xhr.send();
}

function applyAspectRatio() {
    // if the screen is in portrait mode
    if (window.innerHeight > window.innerWidth) {
        let height = window.innerWidth * vidAspectRatio;
        document.getElementById('player').style.height = height + 'px';
    } else {
        document.getElementById('player').style.height = '100%';
    }
}

// on page resize
window.addEventListener('resize', (event) => {
    // resize video height to fit the aspect ratio
    applyAspectRatio();
});

// callback for video playback state changes
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        // resize video height to fit the aspect ratio
        applyAspectRatio();
    }

    // focus notations so we get input
    document.getElementById("player").blur();;
}

