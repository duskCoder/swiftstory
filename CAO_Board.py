import random

class CAO_Board():
    def __init__(self, white_cards, black_cards):
        self.white_pick = white_cards
        self.black_pick = black_cards

        self.white_recycled = []
        self.black_recycled = []

        self.current_black_card = None

        # tupple of cards / player currently being played
        self.played_cards = []

        random.shuffle(self.white_pick)
        random.shuffle(self.black_pick)

    def reveal_black_card(self):
        if not self.black_pick:
            self.black_pick = self.black_recycle

            random.shuffle(self.black_pick)

            self.black_recycled = []

        card = self.black_pick.pop()

        self.current_black_card = card

    def recycle_black_card(self):
        self.black_recycled.append(self.current_black_card)

    def pick_white_card(self):
        if not self.white_pick:
            self.white_pick = self.white_recycled

            random.shuffle(self.white_pick)

            self.white_recycled = []

        card = self.white_pick.pop()

        return card

    def play_card(self, player, card):
        self.played_cards.append((card, player))

    def recycle_played_cards(self):
        self.white_recycled += [i[0] for i in self.played_cards]

        self.played_cards = []
