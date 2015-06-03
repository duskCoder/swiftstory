from CAO_Game import CAO_Game
from CAO_Cards import CAO_Cards

class CAO_GameManager():
    def __init__(self):
        self.games = {}

        self.black_cards = CAO_Cards.get_black_cards()
        self.white_cards = CAO_Cards.get_white_cards()

    def join_game(self, game_name):
        game = self.games.get(game_name)

        if game is None:
            print('Starting new game')
            game = self.games[game_name] = CAO_Game(self.black_cards, self.white_cards)

        return game
