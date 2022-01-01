// get the video id from the url path
function getPathItem(index) {
    var path = window.location.pathname;
    var pathArray = path.split('/');
    var videoId = pathArray[index];
    return videoId;
}

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
    event.target.playVideo();
}

// callback for video playback state changes
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        
    }
}

// function to check if page width or height is greater
function isWider() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    return (width > height);
}

// returns the height the video should be set to
function getVidHeight() {
    var height = isWider() ? window.innerHeight : window.innerWidth;
    return height + 'px';
}

// returns the width the video should be set to
function getVidWidth() {
    var width = isWider() ? window.innerHeight : window.innerWidth;
    console.log(width);
    return width + 'px';
}
