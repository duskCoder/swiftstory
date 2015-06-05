$(document).ready(function() {
    var $home = $("#home");
    var $game = $("#game");
    var $become_judge = $('[data-state="become-judge"]');
    var $judge_collect = $('[data-state="judge-collect"]');
    var $judge_choose = $('[data-state="judge-choose"]');
    var $player_choose = $('[data-state="player-choose"]');
    var $leave_room = $('#leave-room');
    var $all = $("[data-state]");
    var $join_btn = $("#join-btn");
    var $become_judge_btn = $("#become-judge-btn");
    var $black_card = $("#black-card");
    var $played_card_number = $("#played-card-number");
    var $header = $("header");

    $leave_room.click(function () {
        window.location.reload();
    });

    cao.on_socket_open = function() {
        $join_btn.show();
        $join_btn.on("click", function () {
            cao.join_game(prompt('Name of the game'));
        });
    };

    cao.on_join_game_ok = function() {
        $header.show();
        $home.removeClass("current");
        $become_judge.addClass("current");
        $become_judge_btn.on("click", function () {
        $game.addClass("current");
        $all.hide();
        $become_judge.show();
        $become_judge_btn.on("click", function() {
            cao.pick_black_card();
        });
    };

    cao.on_card_played = function(card_number) {
        $played_card_number.text(($played_card_number.text() + 1).toString());
    };

    cao.on_show_white_card = function(idx, desc) {
        var $white_cards = $('#white-cards');
        var identifier = 'white-card-' + idx;
        var content = '<button class="read-only card" id="' + identifier + '">' + desc + '</button>';
        $white_cards.append(content);
        $('#' + identifier).click(function () {
            var $this = $(this);
            if (!$this.hasClass("read-only")) {
                if ($this.hasClass("active")) {
                    this.gen_callback_white_card(idx);
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
        // TODO
    };

    cao.on_judge_needed = function() {
        $all.hide();
        $become_judge.show();
    };

    cao.run();
});
