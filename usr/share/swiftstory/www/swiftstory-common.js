var SwiftStory = function() {
    this.on_socket_open = function() { /* to override */ };
    this.on_socket_close = function() { /* to override */ };
    this.on_socket_error = function(evt) { /* to override */};

    this.on_join_game_ok = function(state) { /* to override */ };
    this.on_show_white_card = function(idx, desc) { /* to override */ };
    this.on_pick_black_card_ok = function() { /* to override */ };
    this.on_show_black_card = function(desc) { /* to override */ };
    this.on_play_white_card_ok = function(idx) { /* to override */ };
    this.on_collect_cards_ok = function() { /* to override */ };
    this.on_show_played_card = function(idx, desc) { /* to override */ };
    this.on_designate_card_ok = function(idx) { /* to override */ };

    this.on_judge_needed = function() { /* to override */ };
    this.on_judge_designed = function() { /* to override */ };
    this.on_player_joined_game = function() { /* to override */ };
    this.on_card_played = function() { /* to override */ };
    this.on_cards_collected = function() { /* to override */ };
    this.on_updated_score = function(new_score) { /* to override */ };
    this.on_change_state = function(state) { /* to override */ };
    this.on_change_nbr_played_cards = function(nbr) { /* to override */ };

    var request_queue = [];

    var judge = false;

    var self = this;
    var ws;

    var lang;

    var nbr_played_cards = 0;

    var played_cards = [];
    var white_cards = {};
    var black_card;

    var score = 0;

    var map_handle_response_ok = {};
    var map_handle_notif = {};

    this.set_lang = function(language) {
        lang = language;
    };

    this.is_judge = function() {
        return judge;
    };

    this.reset_nbr_played_cards = function() {
        nbr_played_cards = 0;

        self.on_change_nbr_played_cards(nbr_played_cards);
    };

    this.incr_nbr_played_cards = function() {
        ++nbr_played_cards;

        self.on_change_nbr_played_cards(nbr_played_cards);
    };

    this.get_white_card_event = function(idx) {
        return white_cards[idx]['event'];
    };

    this.get_played_card_event = function(idx) {
        return played_cards[idx]['event'];
    };

    this.change_state = function(state) {
        game_state = state;

        switch (state) {
            case 'waiting_judge':
                played_cards = [];
                self.reset_nbr_played_cards();
                judge = false;

                self.on_judge_needed();

                break;
            case 'waiting_collection':
                break;
            case 'waiting_designation':
                break;
        }

        this.on_change_state(state);
    };

    /* map_handle_response_ok {{{ */

    map_handle_response_ok['join_game'] = function(result) {
        self.on_join_game_ok();

        self.change_state(result['game_state']);

        map_handle_response_ok['view_player_cards'](result);
    };

    map_handle_response_ok['view_player_cards'] = function(result) {
        for (var i in result['cards']) {
            var idx = result['cards'][i][0];
            var desc = result['cards'][i][1];

            white_cards[idx] = {
                'desc': desc,
                'event': self.gen_callback_white_card(idx)
            };

            self.on_show_white_card(idx, desc)
        }
    };

    map_handle_response_ok['pick_black_card'] = function(result) {
        judge = true;
        self.change_state('waiting_collection');

        self.on_pick_black_card_ok();
        map_handle_response_ok['view_black_card'](result);
    };

    map_handle_response_ok['view_black_card'] = function(result) {
        black_card = result;
        self.on_show_black_card(black_card);
    };

    map_handle_response_ok['play_white_card'] = function(result) {
        idx = result['card_id'];

        self.on_play_white_card_ok(idx);

        delete white_cards[idx];
    };

    map_handle_response_ok['collect_cards'] = function(result) {
        self.change_state('waiting_designation');

        self.on_collect_cards_ok();
        map_handle_response_ok['view_played_cards'](result);
    };

    map_handle_response_ok['view_played_cards'] = function(result) {
        for (var i in result) {
            var desc = result[i];

            played_cards.push({
                'desc': desc,
                'event': self.gen_callback_played_card(i),
            });
            self.on_show_played_card(i, desc);
        }

        if (!result.length) {
            self.gen_callback_played_card(null)();
        }
    };

    map_handle_response_ok['designate_card'] = function(result) {
        self.change_state('waiting_judge');

        self.on_designate_card_ok();
    };

    /* }}} */
    /* handle_notif {{{ */

    map_handle_notif['judge_designed'] = function(result) {
        self.change_state('waiting_collection');

        self.on_judge_designed();
    };

    map_handle_notif['received_card'] = function(result) {
        var idx = result['card']['id'];
        var desc = result['card']['desc'];

        white_cards[idx] = {
            'desc': desc,
            'event': self.gen_callback_white_card(idx)
        };

        self.on_show_white_card(idx, desc);
    };

    map_handle_notif['judge_needed'] = function(result) {
        self.change_state('waiting_judge');
    };

    map_handle_notif['player_joined_game'] = function(result) {
        self.on_player_joined_game();
    };

    map_handle_notif['card_played'] = function(result) {
        self.incr_nbr_played_cards();

        self.on_card_played();
    };

    map_handle_notif['cards_collected'] = function(result) {
        self.change_state('waiting_designation');

        self.on_cards_collected();
    };

    map_handle_notif['updated_score'] = function(result) {
        self.score = result;

        self.on_updated_score(self.score);
    };

    /* }}} */

    this.run = function() {
        /* Use websockets over TLS only when the page is served over TLS. */
        var scheme = (document.location.protocol === 'https:') ? 'wss' : 'ws';

        /* NOTE: We need to access the exact url (no redirection allowed). */
        var uri = scheme + '://' + document.location.host + '/ws/';

        ws = new WebSocket(uri);

        ws.onopen = function() {
            console.log('connection established');
            self.on_socket_open();
        };

        ws.onclose = function() {
            self.on_socket_close();
        };

        ws.onmessage = function(evt) {
            var message = JSON.parse(evt.data);

            if (message['type'] == 'notification') {
                handle_notif(message['content']);
            } else {
                handle_response(message['content']);
            }
        };

        ws.onerror = function(evt) {
            console.log(evt);
            self.on_socket_error(evt);
        };

    };

    var handle_notif = function(notif) {
        if (map_handle_notif[notif['op']]) {
            map_handle_notif[notif['op']](notif['content']);
        } else {
            console.log('unhandled notif ' + notif);
        }
    };

    var handle_response = function(response) {
        var rq = request_queue.shift();

        if (response['status'] != 0) {
            alert(response['info']);
            return;
        }

        if (map_handle_response_ok[rq]) {
            map_handle_response_ok[rq](response['result'])
        } else {
            console.log(evt);
        }
    };

    this.gen_callback_white_card = function(index) {
        return function() {
            var request = {
                'op': 'play_white_card',
                'card_id': index,
            };

            request_queue.push('play_white_card');
            ws.send(JSON.stringify(request));
        };
    };

    this.gen_callback_played_card = function(index) {
        return function() {
            var request = {
                'op': 'designate_card',
                'card_id': index,
            };

            request_queue.push('designate_card');
            ws.send(JSON.stringify(request));
        };
    };

    this.join_game = function(game_name) {
        var request = {
            'op': 'join_game',
            'game_name': game_name,
            'lang': lang,
        };
        request_queue.push('join_game');
        ws.send(JSON.stringify(request));
    };

    this.pick_black_card = function() {
        var request = {
            'op': 'pick_black_card',
        };
        request_queue.push('pick_black_card');
        ws.send(JSON.stringify(request));
    };

    this.collect_cards = function() {
        var request = {
            'op': 'collect_cards',
        };
        request_queue.push('collect_cards');
        ws.send(JSON.stringify(request));
    };

    this.request_show_cards = function() {
        var request = {
            'op': 'view_player_cards',
        };

        request_queue.push('view_player_cards');
        ws.send(JSON.stringify(request));
    };
    this.request_show_black_card = function() {
        var request = {
            'op': 'view_black_card',
        };

        request_queue.push('view_black_card');
        ws.send(JSON.stringify(request));
    };
    this.request_show_played_cards = function() {
        var request = {
            'op': 'view_played_cards',
        };

        request_queue.push('view_played_cards');
        ws.send(JSON.stringify(request));
    };
};

var swst;

$(document).ready(function() {
    swst = new SwiftStory();
});
