$(document).ready(function() {
    var lang;
    var hostname = document.location.hostname;

    /* XXX replace this with your desired behaviour */
    if (hostname.substring(0, 3) === 'fr.') {
        lang = 'fr';
    } else if (hostname.substring(0, 3) === 'en.') {
        lang = 'en';
    }

    cao.set_lang(lang);
});
