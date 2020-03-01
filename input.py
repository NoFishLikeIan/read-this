import inquirer
import os
import re
import functools
import json

from commonmark import commonmark

from pathlib import Path

current_file = Path(__file__).resolve()
read_filepath = Path('./README.md')

res = {
    'topics': lambda string: re.findall(r'### (.*)', string),
    'topic_paragraphs': lambda string: re.findall
}


class Readme_File:
    def __init__(self, path: Path):

        with path.open(mode='r') as read_file:
            raw = read_file.read()

        self.path = path
        self.raw: str = raw

        self.topics = res['topics'](raw)

        self.data = json.loads(commonmark(self.raw, format='json'))
        breakpoint()

    @property
    def all_topics(self):

        by_topic = {}
        latest = None

        for n, elem in enumerate(self.data):
            for children in self.children:
                topic = children.get('literal', False)

                if topic in self.topics:
                    latest = topic
                    by_topic[topic] =


if __name__ == '__main__':
    readme = Readme_File(read_filepath)
