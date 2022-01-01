// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    // set the current theme from local storage
    if (localStorage.getItem('theme') === 'theme-dark') {
        // set the theme
        setTheme('theme-dark');
    } else {
        // set the theme
        setTheme('theme-light');
    }
})();

// when webpage is done loading
window.addEventListener('load', function () {
    // get the slider element
    var slider = document.getElementById('slider');

    // get the switch element
    var switchElement = document.getElementById('switch');

    // show the switch element
    switchElement.style.display = 'inline-block';

    // update the slider
    if (localStorage.getItem('theme') === 'theme-dark') {
        // update the slider
        slider.checked = false;
    } else {
        // update the slider
        slider.checked = true;
    }
});
