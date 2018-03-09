from swiftstory.Player import Player
from swiftstory.Board import Board

from swiftstory.Status import error, success

import json

class Game():
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

        self.board = Board(white_pick, black_pick)

    def try_join(self, client):
        if len(self.players) >= 10:
            return error('too many players in this game')

        cards = []

        try:
            for i in range(10):
                cards.append(self.board.pick_white_card())
        except IndexError:
            return error('no enough white cards for player')

        player = Player(client)

        for card in cards:
            player.receive_card(card)

        client.set_player(player)
        client.set_game(self)

        self.players.append(player)

        for p in self.players:
            if p is not player:
                p.send_notification({'op': 'player_joined_game'})

        cards = self.__view_player_cards(player)

        if self.state is self.WAITING_NEW_JUDGE:
            state = 'waiting_judge'
        elif self.state is self.WAITING_COLLECTION:
            state = 'waiting_collection'
        else:
            state = 'waiting_designation'

        return success({'cards': cards, 'game_state': state})


    def try_become_judge(self, player):
        if self.state is not self.WAITING_NEW_JUDGE:
            # TODO what if the judge has quit ?
            return error('Someone is judge already')

        self.judge = player
        self.board.reveal_black_card()

        self.state = self.WAITING_COLLECTION

        for p in self.players:
            if p is not player:
                p.send_notification({'op': 'judge_designed'})

        return self.try_view_black_card(player)


    def try_play_card(self, player, card_id):
        if self.state is not self.WAITING_COLLECTION:
            return error('Who asked you to play now ?!')

        if self.judge is player:
            return error('You\'re the judge, you silly')
        elif player.get_has_played():
            return error('You already played, you dumb ass')

        try:
            card = player.pop_card(card_id)
        except IndexError:
            return error('Invalid card id')

        player.set_has_played()

        self.board.play_card(player, card)

        self.judge.send_notification({'op': 'card_played'})

        return success({'card_id': card_id})


    def try_collect_cards(self, player):
        if self.state is not self.WAITING_COLLECTION:
            return error('Do you think it\'s the moment for colletion !?')

        if self.judge is not player:
            return error('You\'re not the judge, you fool!')

        self.board.shuffle_played_cards()

        # we prevent the others to play
        self.state = self.WAITING_DESIGNATION

        for p in self.players:
            if p is not player:
                p.send_notification({'op': 'cards_collected'})

        return self.try_view_played_cards(player)


    def try_designate_card(self, player, card_id):
        if self.state is not self.WAITING_DESIGNATION:
            return error('Not now, moron !')

        if self.judge is not player:
            return error('Who do you think you are !?')

        if card_id is None and len(self.board.played_cards) > 0:
            return error('There are cards on the board, pick one !')

        if card_id is not None or len(self.board.played_cards) > 0:
            # if there are cards on the board
            # TODO check exception
            try:
                card, winner = self.board.played_cards[card_id]
            except IndexError:
                return error('Invalid card')

            winner.inc_score()

            # put the cards back in the deck
            self.board.recycle_played_cards()

            # reset the state of the players
            for p in self.players:
                if p.get_has_played():
                    idx = p.receive_card(self.board.pick_white_card())
                    card_idx = p.cards[idx]
                    card_desc = self.white_desc[card_idx]

                    p.send_notification({
                        'op': 'received_card',
                        'content': {
                            'card': {
                                'id': idx,
                                'desc': card_desc,
                                },
                            },
                        })
                    p.set_has_played(False)

        self.board.recycle_black_card()
        self.judge = None

        for p in self.players:
            if p is not player:
                p.send_notification({'op': 'judge_needed'})

        self.state = self.WAITING_NEW_JUDGE

        return success(None)

    def __view_player_cards(self, player):
        cards = []

        for card in player.cards:
            cards.append((card, self.white_desc[player.cards[card]]))

        return cards

    def try_view_player_cards(self, player):
        return success(self.__view_player_cards(player))

    def try_view_played_cards(self, player):
        if self.state is not self.WAITING_DESIGNATION:
            return error('Not now, moron !')

        cards = []

        for card, unused in self.board.played_cards:
            cards.append(self.white_desc[card])

        return success(cards)

    def try_view_black_card(self, player):
        card = self.board.current_black_card

        if card is not None:
            return success(self.black_desc[card])

        return error('The black card has not been revealed yet')

    def disconnect(self, player):
        player.client = None

        if self.judge is player:
            self.board.recycle_black_card()
            self.judge = None

            for p in self.players:
                p.send_notification({'op': 'judge_needed'})

            for card, p in self.board.played_cards:
                idx = p.receive_card(card)
                card_idx = p.cards[idx]
                card_desc = self.white_desc[card_idx]

                p.send_notification({
                    'op': 'received_card',
                    'content': {
                        'card': {
                            'id': idx,
                            'desc': card_desc,
                            },
                        },
                    })
                p.set_has_played(False)

            self.board.played_cards = []
            self.state = self.WAITING_NEW_JUDGE
