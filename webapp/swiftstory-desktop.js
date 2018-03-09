$(document).ready(function() {
    $('#btn_join').click(function() {
        var game_name = prompt('Name of the game');

        swst.join_game(game_name);
    });

    $('#btn_pick_black').click(function() {
        swst.pick_black_card();
    });

    $('#btn_collect').click(function() {
        swst.collect_cards();
    });

    swst.on_socket_open = function() {
        $('#btn_join').show();
    };

    swst.on_join_game_ok = function(state) {
        $('#btn_join').hide();
        $('#btn_pick_black').show();
        $('#white_cards').show();
    };

    swst.on_show_white_card = function(idx, desc) {
        identifier = 'white_card_' + idx;
        content = '<li id="' + identifier + '">' + desc + '</li>';

        $('#white_cards').append(content);

        $('#' + identifier).dblclick(this.gen_callback_white_card(idx));
    };

    swst.on_show_played_card = function(idx, desc) {
        identifier = 'played_card_' + idx;

        content = '<li id="' + identifier + '">' + desc + '</li>';

        $('#played_cards').append(content);

        $('#' + identifier).dblclick(this.gen_callback_played_card(idx));
    };


    swst.on_pick_black_card_ok = function() {
        $('#btn_collect').show();
        $('#btn_pick_black').hide();
    };

    swst.on_show_black_card = function(desc) {
        $('#black_card').show();
        $('#black_card').html(desc);
    };


    swst.on_play_white_card_ok = function(idx) {
        identifier = 'white_card_' + idx;
        $('#' + identifier).remove();
    };

    swst.on_designate_card_ok = function() {
        $('#played_cards').empty();
        $('#played_cards').hide();
        $('#black_card').hide();
        $('#btn_collect').hide();
        $('#btn_pick_black').show();
    };

    swst.on_collect_cards_ok = function() {
        $('#btn_collect').hide();
        $('#played_cards').show();
    };

    swst.on_judge_designed = function() {
        $('#btn_pick_black').hide();
    };

    swst.on_judge_needed = function() {
        $('#btn_pick_black').show();
    };

    swst.on_updated_score = function(score) {
        console.log('new score: ' + score);
    };

    swst.run();
});
