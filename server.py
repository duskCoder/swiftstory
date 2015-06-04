#!/usr/bin/env python

from websocket_server import WebsocketServer
import CAO_GameManager
import CAO_Client
from CAO_Status import cao_error

import json

game_manager = CAO_GameManager.CAO_GameManager()

def new_client_handler(client, server):
    client['cao_client'] = CAO_Client.CAO_Client(game_manager)

def client_left_handler(client, server):
    pass

def message_received_handler(client, server, message):
    try:
        json_msg = json.loads(message)
    except:
        res = cao_error('badly formatted json')
    else:
        op = json_msg['op']
        if op == 'join_game':
            try:
                game_name = json_msg['game_name']
            except KeyError:
                res = cao_error('field `game_name\' is required')
            else:
                res = client['cao_client'].join_game(game_name)
        elif op == 'view_player_cards':
            res = client['cao_client'].view_player_cards()
        elif op == 'view_played_cards':
            res = client['cao_client'].view_played_cards()
        elif op == 'pick_black_card':
            res = client['cao_client'].pick_black_card()
        elif op == 'designate_card':
            try:
                card_id = json_msg['card_id']
            except KeyError:
                res = cao_error('field `card_id\' is required')
            else:
                res = client['cao_client'].designate_card(card_id)
        elif op == 'play_white_card':
            try:
                card_id = json_msg['card_id']
            except KeyError:
                res = cao_error('field `card_id\' is required')
            else:
                res = client['cao_client'].play_white_card(card_id)
        elif op == 'collect_cards':
            res = client['cao_client'].collect_cards()
        else:
            res = cao_error('invalid command')

    server.send_message(client, res)

def main():
    server = WebsocketServer(1236)
    server.set_fn_new_client(new_client_handler)
    server.set_fn_client_left(client_left_handler)
    server.set_fn_message_received(message_received_handler)

    server.run_forever()

if __name__ == '__main__':
    main()
