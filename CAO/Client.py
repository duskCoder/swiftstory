from CAO.Status import cao_error
from CAO.Game import Game

class Client():
    def __init__(self, socket, handler, game_manager):
        self.game = None
        self.game_manager = game_manager

        self.handler = handler
        self.socket = socket
        self.player = None

    def join_game(self, game_name, lang):
        if self.game is not None:
            return cao_error('You are already in a game')

        if lang is None:
            lang = 'en'

        game = self.game_manager.join_game(game_name, lang)
        # XXX self.game will be assigned by game.try_join()

        if game is None:
            return cao_error('Invalid language')

        return game.try_join(self)

    def set_game(self, game):
        self.game = game
    def set_player(self, player):
        self.player = player

    def play_white_card(self, card_id):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_play_card(self.player, card_id)

    def pick_black_card(self):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_become_judge(self.player)

    def collect_cards(self):
        if self.game is None:
            cao_error('You have to join a game first')
        return self.game.try_collect_cards(self.player)

    def designate_card(self, card_id):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_designate_card(self.player, card_id)

    def view_player_cards(self):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_view_player_cards(self.player)

    def view_played_cards(self):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_view_played_cards(self.player)

    def view_black_card(self):
        if self.game is None:
            return cao_error('You have to join a game first')
        return self.game.try_view_black_card(self.player)

    def send_notification(self, message):
        self.socket.send_message(self.handler, message)

    def disconnect(self):
        if self.player is not None:
            self.player.client = None
