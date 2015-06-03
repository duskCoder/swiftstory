class CAO_Player():
    def __init__(self, client, cards):
        self.cards = cards
        self.client = client

        self.score = 0

        self.has_played = False

        self.name = 'default'

    def pop_card(self, card_id):
        return self.cards.pop(card_id)


    def get_has_played(self):
        return self.has_played

    def set_has_played(self, has=True):
        self.has_played = has

    def inc_score(self):
        self.score += 1
