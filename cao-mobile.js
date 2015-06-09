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

    cao.on_socket_open = function() {
        $join_btn.show();
        $join_btn.on("click", function () {
            cao.join_game(prompt('Name of the game'));
        });
    };

    cao.on_join_game_ok = function(game_state) {
        $header.show();
        $home.removeClass("current");
        $game.addClass("current");
        $all.hide();
        switch (game_state) {
            case "waiting_collection":
                $player_choose.show();
                $white_cards.removeClass("read-only");
                break;
            case "waiting_designation":
                $player_wait.show();
                $white_cards.addClass("read-only");
                break;
            case "waiting_judge":
                $become_judge.show();
                $become_judge_btn.on("click", function() {
                    cao.pick_black_card();
                });
                break;
        }
    };

    cao.on_show_white_card = function(idx, desc) {
        var identifier = 'white-card-' + idx;
        var content = '<button class="read-only card" id="' + identifier + '">' + desc + '</button>';
        $white_cards.append(content);
        var self = this;
        $('#' + identifier).click(function () {
            var $this = $(this);
            if (!$white_cards.hasClass("read-only")) {
                if ($this.hasClass("active")) {
                    self.gen_callback_white_card(idx);
                } else {
                    $white_cards.find("> .card").removeClass("active");
                    $(this).addClass("active");
                }
            }
        });
    };

    cao.on_show_played_card = cao.on_show_white_card;


    cao.on_pick_black_card_ok = function() {
        $all.hide();
        $judge_collect.show();
    };

    cao.on_show_black_card = function(desc) {
        $('#black-card').html(desc);
    };


    cao.on_play_white_card_ok = function(idx) {
        $('#white-card-' + identifier).remove();
    };

    cao.on_designate_card_ok = function() {
        // TODO
    };

    cao.on_collect_cards_ok = function() {
        $all.hide();
        $judge_choose.show();
    };

    cao.on_judge_designed = function() {
        $all.hide();
        $player_choose.show();
        $white_cards.removeClass("read-only");
    };

    cao.on_judge_needed = function() {
        $all.hide();
        $become_judge.show();
    cao.on_updated_score = function(score) {
        $score_value.text(score);
    };

    cao.on_change_nbr_played_cards = function(nbr) {
        $played_card_number.text(nbr);
    };

    cao.run();
});
