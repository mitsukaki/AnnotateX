// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Create an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: getVidHeight(),
        width: getVidWidth(),
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
}

// callback for video playback state changes
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {

    }
}

