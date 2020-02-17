import inquirer
import os
import re
from pathlib import Path
import functools

current_file = Path(__file__).resolve()
read_filepath = Path('./README.md')


def compose(*functions):

    return functools.reduce(lambda f, g: lambda *args: g(*f(*args)),
                            functions)


def non_empty(iterable):
    return [it for it in iterable if len(it.strip()) > 0]


def make_parser(regex):
    def parse(prev_match, string):

        splitted = non_empty(re.split(regex, string, 1))

        if len(splitted) > 1:
            match, rest = splitted
            return [*prev_match, match], rest
        else:
            return prev_match, string

    return parse


class Readme_File:
    def __init__(self, path: Path):

        with path.open(mode='r') as read_file:
            raw = read_file.read()

        self.path = path
        self.__raw: str = raw
        split = re.split(r'###', raw)
        intro = split[0]
        categories = split[1:]
        self.intro = intro
        self.__categories = categories

    @property
    def category_names(self):
        return list(self.categories.keys())

    @property
    def categories(self):
        map_categories = dict(parse_category(category)
                              for category in self.__categories)

        return map_categories

    @property
    def get_raw():
        pass

    def append_entry(
        self,
        title: str,
        link: str,
        category: str,
        read=False,
        content=''
    ):
        if category not in self.categories:
            raise ValueError(f'Category {category} not recognized!')

        return

    def write_current(self):
        with self.path.open(mode='w') as file:
            pass


def parse_category(category_string: str):
    category_name, *items = re.split(
        r"- \[(?:x|\s)\]", category_string)

    parsed_items = [parse_item(it.strip()) for it in items]

    return category_name.strip(), parsed_items


def parse_item(raw_item: str):

    get_name = make_parser(r'\[_(.*?)_\]')
    get_link = make_parser(r'\((.*?)\)')

    parser = compose(get_name, get_link)

    parsed, content = parser([], raw_item)
    entry_name, link = parsed

    return (entry_name, link, content)


def input_new_item(readme: Readme_File):

    categories = list(readme.category_names)

    quest_categories = [
        inquirer.List("category",
                      message="What category are we talking about?",
                      choices=categories
                      )]

    print(categories)

    # res = inquirer.prompt(quest_categories)
    # print(res['category'])


if __name__ == '__main__':
    readme = Readme_File(read_filepath)

    input_new_item(readme)
