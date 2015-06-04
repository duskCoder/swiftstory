var CAO = function() {
    this.on_socket_open = function() { /* to override */ };
    this.on_socket_close = function() { /* to override */ };
    this.on_socket_error = function(evt) { /* to override */};

    this.on_join_game_ok = function() { /* to override */ };
    this.on_show_white_card = function(idx, desc) { /* to override */ };
    this.on_pick_black_card_ok = function() { /* to override */ };
    this.on_show_black_card = function(desc) { /* to override */ };
    this.on_play_white_card_ok = function(idx) { /* to override */ };
    this.on_collect_cards_ok = function() { /* to override */ };
    this.on_show_played_card = function(idx, desc) { /* to override */ };
    this.on_designate_card_ok = function(idx) { /* to override */ };

    var request_queue = [];

    var self = this;
    var ws;

    var played_cards = [];
    var white_cards = {};
    var black_card;

    this.run = function() {
        ws = new WebSocket('ws://' + document.location.hostname + ':1236');

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
                handle_notification(message['content']);
            } else {
                handle_response(message['content']);
            }
        };

        ws.onerror = function(evt) {
            console.log(evt);
            self.on_socket_error(evt);
        };

    };

    var handle_notification = function(msg) {
        console.log('notification:');
        console.log(msg);
    };

    var handle_response = function(response) {
        var rq = request_queue.shift();

        if (response['status'] != 0) {
            alert(response['info']);
        }

        switch (rq) {
            case 'join_game':
                console.log(response);
                if (response['status'] != 0) {
                    break;
                }
                console.log('just joined the game');
                self.on_join_game_ok();
                /* self.request_show_cards(); */
                /* XXX intentional fallback */
            case 'view_player_cards':
                if (response['status'] == 0) {
                    $('#white_cards').show();
                    for (var i in response['result']) {
                        var idx = response['result'][i][0];
                        var desc = response['result'][i][1];

                        white_cards[idx] = desc;

                        self.on_show_white_card(idx, desc);
                    }
                }
                break;
            case 'pick_black_card':
                if (response['status'] != 0) {
                    break;
                }
                self.on_pick_black_card_ok();
                /* self.request_show_black_card(); */
                /* XXX intentional fallback */

            case 'view_black_card':
                if (response['status'] == 0) {
                    black_card = response['result'];
                    self.on_show_black_card(black_card);
                }
                break;
            case 'play_white_card':
                if (response['status'] == 0) {
                    idx = response['result']['card_id'];

                    self.on_played_white_card_ok(idx);

                    delete white_cards[idx];
                }
                break;
            case 'collect_cards':
                if (response['status'] != 0) {
                    break;
                }
                self.on_collect_cards_ok();
                /* XXX intentional fallback */
            case 'view_played_cards':
                if (response['status'] == 0) {
                    for (var i in response['result']) {
                        var desc = response['result'][i];

                        played_cards.push(desc);
                        self.on_show_played_card(i, desc);
                    }
                }
                break;
            case 'designate_card':
                if (response['status'] == 0) {
                    self.on_designate_card_ok(idx);

                    played_cards = [];
                }
                break;
            default:
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

    $('#btn_join').click(function() {
        var game_name = prompt('Name of the game');

        var request = {
            'op': 'join_game',
            'game_name': game_name,
        };
        request_queue.push('join_game');
        ws.send(JSON.stringify(request));
    });

    $('#btn_pick_black').click(function() {
        var request = {
            'op': 'pick_black_card',
        };
        request_queue.push('pick_black_card');
        ws.send(JSON.stringify(request));
    });

    $('#btn_collect').click(function() {
        var request = {
            'op': 'collect_cards',
        };
        request_queue.push('collect_cards');
        ws.send(JSON.stringify(request));
    });

    this.request_show_cards = function() {
        var request = {
            'op': 'view_player_cards',
        };

        request_queue.push('view_player_cards');
        console.log(request);
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

var cao;

$(document).ready(function() {
    cao = new CAO();
});
