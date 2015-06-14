from distutils.core import setup

packages = [
        'CAO',
        ]

data_files = [
        ('lang', [
            'lang/en/cards/black',
            'lang/en/cards/white',
            'lang/fr/cards/black',
            'lang/fr/cards/white',
            ]),
        ]

scripts = [
        'cao-server',
        ]

setup(
        name='cao',
        version='0.1',
        packages=packages,
        data_files=data_files,
        scripts=scripts,
        )
