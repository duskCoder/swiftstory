from CAO_Player import CAO_Player
from CAO_Board import CAO_Board

import json

class CAO_Game():
    WAITING_NEW_JUDGE = 0,
    WAITING_COLLECTION = 1,
    WAITING_DESIGNATION = 2,


    def __init__(self, white_desc, black_desc):
        self.white_desc = white_desc
        self.black_desc = black_desc

        white_pick = [i for i in range(len(self.white_desc))]
        black_pick = [i for i in range(len(self.black_desc))]

        self.state = self.WAITING_NEW_JUDGE

        self.players = []

        self.judge = None

        self.board = CAO_Board(white_pick, black_pick)

    def try_join(self, client):
        if len(self.players) >= 10:
            return ('ERR', 'too many players in this game')

        cards = []

        try:
            for i in range(10):
                cards.append(self.board.pick_white_card())
        except IndexError:
            return ('ERR', 'no enough white cards for player')

        player = CAO_Player(client, cards)
        client.set_player(player)

        self.players.append(player)

        return ('OK', '')


    def try_become_judge(self, player):
        if self.state is not self.WAITING_NEW_JUDGE:
            # TODO what if the judge has quit ?
            return ('ERR', 'Someone is judge already')

        self.judge = player
        self.board.reveal_black_card()

        self.state = self.WAITING_COLLECTION

        return ('OK', '')


    def try_play_card(self, player, card_id):
        if self.state is not self.WAITING_COLLECTION:
            return ('ERR', 'Who asked you to play now ?!')

        if self.judge is player:
            return ('ERR', 'You\'re the judge, you silly')
        elif player.get_has_played():
            return ('ERR', 'You already played, you dumb ass')

        try:
            card = player.pop_card(card_id)
        except IndexError:
            return ('ERR', 'Invalid card id')

        player.set_has_played()

        self.board.play_card(player, card)

        return ('OK', '')


    def try_collect_cards(self, player):
        if self.state is not self.WAITING_COLLECTION:
            return ('ERR', 'Do you think it\'s the moment for colletion !?')

        if self.judge is not player:
            return ('ERR', 'You\'re not the judge, you fool!')

        self.board.shuffle_played_cards()

        # we prevent the others to play
        self.state = self.WAITING_DESIGNATION

        return ('OK', '')


    def try_designate_card(self, player, card_id):
        if self.state is not self.WAITING_DESIGNATION:
            return ('ERR', 'Not now, moron !')

        if self.judge is not player:
            return ('ERR', 'Who do you think you are !?')

        if card_id is None and len(self.board.played_cards) > 0:
            return ('ERR', 'There are cards on the board, pick one !')

        if card_id is not None or len(self.board.played_cards) > 0:
            # if there are cards on the board
            # TODO check exception
            try:
                card, winner = self.board.played_cards[card_id]
            except IndexError:
                return ('ERR', 'Invalid card')

            winner.inc_score()

            # put the cards back in the deck
            self.board.recycle_played_cards()

            # reset the state of the players
            for p in self.players:
                if p.get_has_played:
                    p.cards.append(self.board.pick_white_card())
                    p.set_has_played(False)

        self.board.recycle_black_card()
        self.judge = None # useful or not ...

        self.state = self.WAITING_NEW_JUDGE

        return ('OK', '')

    def try_view_player_cards(self, player):
        cards = []

        for card in player.cards:
            cards.append(self.white_desc[card])

        return ('OK', json.dumps(cards))

    def try_view_played_cards(self, player):
        if self.state is not self.WAITING_DESIGNATION:
            return ('ERR', 'Not now, moron !')

        cards = []

        for card, unused in self.board.played_cards:
            cards.append(self.white_desc[card])

        return ('OK', json.dumps(cards))
