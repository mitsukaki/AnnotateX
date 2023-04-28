tippy('#info', {
    content: `
        <span class="heavy">SHORTCUTS</span>
        <table>
            <tr>
                <th>Enter</th>
                <td>Save Note</td>
            </tr>
            <tr>
                <th>Left</th>
                <td>Rewind 5s</td>
            </tr>
            <tr>
                <th>Right</th>
                <td>Forward 5s</td>
            </tr>
            <tr>
                <th>Space</th>
                <td>Play/Pause</td>
            </tr>
            <tr>
                <th>Shift + Up</th>
                <td>Speed Up</td>
            </tr>
            <tr>
                <th>Shift + Down</th>
                <td>Slow Down</td>
            </tr>
        </table>
        <br>video <span class="heavy">pauses automatically</span><br> when you type.
        <br>
        <br>made by <span class="heavy">mitsukaki</span>.
    `,
    allowHTML: true,
    trigger: 'mouseenter click',
    arrow: true
});

tippy('#switch', {
    content: "Swap Dark/Light theme",
    arrow: true
});