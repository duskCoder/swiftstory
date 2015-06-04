$(document).ready(function() {
    request_queue = []
    var map_white_idx_row = {};

    var ws = new WebSocket('ws://' + document.location.hostname + ':1236');

    var self = this;

    ws.onopen = function() {
        console.log('connection established');
        $('#btn_join').show();
    };

    ws.onclose = function() {
    };

    ws.onmessage = function(evt) {
        message = JSON.parse(evt.data);

        if (message['type'] == 'notification') {
            handle_notification(message['content']);
        } else {
            handle_response(message['content']);
        }
    };

    var handle_notification = function(msg) {
        console.log('notification:');
        console.log(msg);
    };

    var handle_response = function(response) {
        rq = request_queue.shift();

        if (response['status'] != 0) {
            alert(response['info']);
        }

        switch (rq) {
            case 'join_game':
                console.log(response);
                if (response['status'] != 0) {
                    break;
                }
                $('#btn_join').hide();
                $('#btn_pick_black').show();
                console.log('just joined the game');
                /* self.request_show_cards(); */
                /* XXX intentional fallback */
            case 'view_player_cards':
                if (response['status'] == 0) {
                    $('#white_cards').show();
                    for (i in response['result']) {
                        element = $('.card_desc').eq(i);
                        element.html(response['result'][i][1]);
                        element.dblclick(gen_callback_white_card(i));
                        map_white_idx_row[response['result'][i][0]] = i;
                    }
                }
                break;
            case 'pick_black_card':
                if (response['status'] != 0) {
                    break;
                }
                $('#btn_collect').show();
                $('#btn_pick_black').hide();
                /* self.request_show_black_card(); */
                /* XXX intentional fallback */

            case 'view_black_card':
                if (response['status'] == 0) {
                    $('#black_card').show();
                    $('#black_card').html(response['result']);
                }
                break;
            case 'play_white_card':
                if (response['status'] == 0) {
                    row = map_white_idx_row[response['result']['card_id']];

                    element = $('.card_desc').eq(row);
                    element.empty();
                    element.dblclick(null)
                }
                break;
            case 'collect_cards':
                if (response['status'] != 0) {
                    break;
                }
                $('#btn_collect').hide();
                /* XXX intentional fallback */
            case 'view_played_cards':
                if (response['status'] == 0) {
                    for (i in response['result']) {
                        console.log(response['result'][i]);
                    }
                }
                break;
            default:
                console.log(evt);
        }
    };

    ws.onerror = function(evt) {
        alert(evt);
    };

    var gen_callback_white_card = function(index) {
        return function() {
            request = {
                'op': 'play_white_card',
                'card_id': index,
            };

            request_queue.push('play_white_card');
            ws.send(JSON.stringify(request));
        };
    };

    $('#btn_join').click(function() {
        game_name = prompt('Name of the game');

        request = {
            'op': 'join_game',
            'game_name': game_name,
        };
        request_queue.push('join_game');
        ws.send(JSON.stringify(request));
    });

    $('#btn_pick_black').click(function() {
        request = {
            'op': 'pick_black_card',
        };
        request_queue.push('pick_black_card');
        ws.send(JSON.stringify(request));
    });

    $('#btn_collect').click(function() {
        request = {
            'op': 'collect_cards',
        };
        request_queue.push('collect_cards');
        ws.send(JSON.stringify(request));
    });

    this.request_show_cards = function() {
        request = {
            'op': 'view_player_cards',
        };

        request_queue.push('view_player_cards');
        console.log(request);
        ws.send(JSON.stringify(request));
    };
    this.request_show_black_card = function() {
        request = {
            'op': 'view_black_card',
        };

        request_queue.push('view_black_card');
        ws.send(JSON.stringify(request));
    };
    this.request_show_played_cards = function() {
        request = {
            'op': 'view_played_cards',
        };

        request_queue.push('view_played_cards');
        ws.send(JSON.stringify(request));
    };
});
