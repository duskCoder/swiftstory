from CAO_Game import CAO_Game

class CAO_Client():
    def __init__(self, game_manager):
        self.game = None
        self.game_manager = game_manager

        self.player = None

    def join_game(self, game_name):
        if self.game is not None:
            return ('ERR', 'You are already in a game')

        self.game = self.game_manager.join_game(game_name)
        return self.game.try_join(self)

    def set_player(self, player):
        self.player = player

    def play_white_card(self, card_id):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_play_card(self.player, card_id)

    def pick_black_card(self):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_become_judge(self.player)

    def collect_cards(self):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_collect_cards(self.player)

    def designate_card(self, card_id):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_designate_card(self.player, card_id)

    def view_player_cards(self):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_view_player_cards(self.player)

    def view_played_cards(self):
        if self.game is None:
            return ('ERR', 'You have to join a game first')
        return self.game.try_view_played_cards(self.player)
