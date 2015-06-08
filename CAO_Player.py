import json

class CAO_Player():
    def __init__(self, client):
        self.cards = {}
        self.next_idx = 0

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
        self.send_notification({
            'op': 'updated_score',
            'content': self.score,
            })

    def receive_card(self, card):
        self.cards[self.next_idx] = card
        self.next_idx += 1
        return self.next_idx - 1

    def send_notification(self, obj):
        if self.client is None:
            return

        message = json.dumps({'type': 'notification', 'content': obj})

        self.client.send_notification(message)
