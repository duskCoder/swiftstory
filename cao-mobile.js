$(document).ready(function() {
    var $home = $("#home");
    var $game = $("#game");
    var $become_judge = $('[data-state="become-judge"]');
    var $judge_collect = $('[data-state="judge-collect"]');
    var $judge_choose = $('[data-state="judge-choose"]');
    var $player_choose = $('[data-state="player-choose"]');
    var $player_wait = $('[data-state="player-wait"]');
    var $leave_room = $('#leave-room');
    var $all = $("[data-state]");
    var $join_btn = $("#join-btn");
    var $become_judge_btn = $("#become-judge-btn");
    var $black_card = $("#black-card");
    var $played_card_number = $("#played-card-number");
    var $header = $("header");
    var $white_cards = $('#white-cards');
    var $score_value = $('#score-value');

    $leave_room.click(function () {
        window.location.reload();
    });

    $become_judge_btn.click(function() {
        cao.pick_black_card();
    });

    $join_btn.click(function () {
        cao.join_game(prompt('Name of the game'));
    });

    cao.on_socket_open = function() {
        $join_btn.show();
    };

    cao.on_join_game_ok = function() {
        $header.show();
        $home.removeClass("current");
        $game.addClass("current");
        $all.hide();
    };

    cao.on_change_state = function(state) {
        $all.hide();

        switch (state) {
            case 'waiting_judge':
                $become_judge.show();
                break;
            case 'waiting_designation':
                if (cao.is_judge()) {
                    $judge_choose.show();
                } else {
                    $player_wait.show();
                    $white_cards.attr('disabled', true);
                    $white_cards.addClass('read-only');
                }
                break;
            case 'waiting_collection':
                if (cao.is_judge()) {
                    $judge_collect.show();
                    $white_cards.attr('disabled', true);
                    $white_cards.addClass('read-only');
                } else {
                    $player_choose.show();
                    $white_cards.removeAttr('disabled');
                    $white_cards.removeClass('read-only');
                }
                break;
            default:
                console.log('unhandled state');
                break;
        }
    };

    cao.on_show_white_card = function(idx, desc) {
        var identifier = 'white-card-' + idx;
        var content = '<button name="' + idx + '" class="read-only card" id="' + identifier + '">' + desc + '</button>';
        $white_cards.append(content);
        var self = this;
        $('#' + identifier).click(function () {
            var $this = $(this);
            if (!$white_cards.attr('disabled')) {
                if ($this.hasClass("active")) {
                    cao.get_white_card_event($this.prop('name'))();
                } else {
                    $white_cards.find("> .card").removeClass("active");
                    $this.addClass("active");
                }
            }
        });
    };

    cao.on_show_played_card = cao.on_show_white_card;

    cao.on_show_black_card = function(desc) {
        $('#black-card').html(desc);
    };

    cao.on_play_white_card_ok = function(idx) {
        $white_cards.attr('disabled', true);
        $white_cards.addClass('read-only');

        $player_wait.show();

        $('#white-card-' + idx).remove();
    };

    cao.on_updated_score = function(score) {
        $score_value.text(score);
    };

    cao.on_change_nbr_played_cards = function(nbr) {
        $played_card_number.text(nbr);
    };

    cao.run();
});
