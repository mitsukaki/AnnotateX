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
    return width + 'px';
}

// get the video id from the url path
function getPathItem(index) {
    var path = window.location.pathname;
    var pathArray = path.split('/');
    var videoId = pathArray[index];
    return videoId;
}
