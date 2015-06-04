$(document).ready(function() {
    var ws = new WebSocket('ws://' + document.location.host + ':1236');

    ws.onopen = function() {
    };

    ws.onclose = function() {
    };

    ws.onmessage = function(evt) {
    };

    ws.onerror = function(evt) {
    };
});
