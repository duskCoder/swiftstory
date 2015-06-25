$(document).ready(function() {
    var lang;
    var hostname = document.location.hostname;

    /* XXX replace this with your desired behaviour */
    if (hostname.startsWith('fr.')) {
        lang = 'fr';
    } else if (hostname.startsWith('en.')) {
        lang = 'en';
    }

    cao.set_lang(lang);
});
