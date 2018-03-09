from distutils.core import setup

packages = [
        'swiftstory',
        ]

prefix = '/'
share_dir = 'usr/share/swiftstory/'

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
        'swiftstoryd',
        ]

setup(
        name='swiftstory',
        version='0.1',
        author='Olivier Gayot',
        author_email='olivier.gayot@sigexec.com',
        packages=packages,
        data_files=data_files,
        scripts=scripts,
        )
