from distutils.core import setup

packages = [
        'CAO',
        ]

prefix = '/'
share_dir = 'usr/share/cao/'

data_files = list()

import os

for n in os.walk('usr'):
    if len(n[2]) == 0:
        continue

    files = list()
    for f in n[2]:
        files.append(n[0] + '/' + f)

    data_files.append((prefix + n[0] + '/', files))

print(data_files)

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
