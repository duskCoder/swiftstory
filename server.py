#!/usr/bin/env python

from websocket_server import WebsocketServer
from CAO_Cards import CAO_Cards

def new_client_handler(client, server):
    print('client ' + client['id'] + ' just joined')

def client_left_handler(client, server):
    print('client just left')

def message_received_handler(client, server, message):
    print('received from client ' + client['id'] + ': [%s]' % message)

def main():
    server = WebsocketServer(1236)

    server.set_fn_new_client(new_client_handler)
    server.set_fn_client_left(client_left_handler)
    server.set_fn_message_received(message_received_handler)
    server.run_forever()

if __name__ == '__main__':
    main()
