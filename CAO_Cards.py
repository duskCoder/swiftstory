class CAO_Cards():
    @staticmethod
    def get_white_cards():
        ''' Read the file containing the white cards and return a list of cards '''
        with open('white_cards') as fd:
            return [line.strip() for line in fd]

    @staticmethod
    def get_black_cards():
        ''' Read the file containing the black cards and return a list of cards '''

        with open('black_cards') as fd:
            return [line.strip() for line in fd]
