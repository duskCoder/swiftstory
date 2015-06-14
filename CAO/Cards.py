class Cards():
    @staticmethod
    def get_white_cards(lang):
        ''' Read the file containing the white cards and return a list of cards '''
        with open('lang/' + lang + '/cards/white') as fd:
            return [line.strip() for line in fd]

    @staticmethod
    def get_black_cards(lang):
        ''' Read the file containing the black cards and return a list of cards '''

        with open('lang/' + lang + '/cards/black') as fd:
            return [line.strip() for line in fd]
