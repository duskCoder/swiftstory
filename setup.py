from setuptools import setup, find_packages

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

setup(
        name = 'swiftstory',
        description = "SwiftStory game: We're not out of the woods yet.",
        version = '0.1',
        author = 'Olivier Gayot',
        author_email = 'olivier.gayot@sigexec.com',
        packages = find_packages(),
        data_files = data_files,
        entry_points = {
            'console_scripts': [
                'swiftstoryd = swiftstory.SwiftStory:main',
            ],
        }
)
