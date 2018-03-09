#!/usr/bin/env python

from websocket_server import WebsocketServer
import swiftstory.GameManager
import swiftstory.Client
from swiftstory.Status import error

import json

game_manager = swiftstory.GameManager.GameManager()

def new_client_handler(client, server):
    client['client'] = swiftstory.Client.Client(server, client, game_manager)

def client_left_handler(client, server):
    client['client'].disconnect();

def message_received_handler(client, server, message):
    try:
        json_msg = json.loads(message)
    except:
        res = error('badly formatted json')
    else:
        op = json_msg['op']
        if op == 'join_game':
            try:
                game_name = json_msg['game_name']
            except KeyError:
                res = error('field `game_name\' is required')
            else:
                lang = json_msg.get('lang')
                res = client['client'].join_game(game_name, lang)
        elif op == 'view_player_cards':
            res = client['client'].view_player_cards()
        elif op == 'view_black_card':
            res = client['client'].view_black_card()
        elif op == 'view_played_cards':
            res = client['client'].view_played_cards()
        elif op == 'pick_black_card':
            res = client['client'].pick_black_card()
        elif op == 'designate_card':
            card_id = None
            try:
                card_id = int(json_msg['card_id'])
            except (KeyError, TypeError):
                pass
            finally:
                res = client['client'].designate_card(card_id)
        elif op == 'play_white_card':
            try:
                card_id = int(json_msg['card_id'])
            except KeyError:
                res = error('field `card_id\' is required')
            else:
                res = client['client'].play_white_card(card_id)
        elif op == 'collect_cards':
            res = client['client'].collect_cards()
        else:
            res = error('invalid command')

    server.send_message(client, res)

def main():
    server = WebsocketServer(1236, '0.0.0.0')
    server.set_fn_new_client(new_client_handler)
    server.set_fn_client_left(client_left_handler)
    server.set_fn_message_received(message_received_handler)

    server.run_forever()

if __name__ == '__main__':
    main()
