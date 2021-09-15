#! /usr/bin/env python3
# -*- coding: utf-8 -*-

# <link href="https://fonts.googleapis.com/css?family=Droid+Serif|Source+Sans+Pro" rel="stylesheet">
# <link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}">

import os
from jinja2 import Environment, FileSystemLoader


class MySiteGenerator:
    """Generate all static html pages using Jinja2 templates"""
    def __init__(self, out_dir):
        if not os.path.exists(out_dir):
            os.mkdir(out_dir)

        # TODO: check for file modifications, rebuild based on page template tree
        
        self.env = Environment(loader=FileSystemLoader('src/templates'))
        template = self.env.get_template('index.html')
        html = template.render(
            page_title = 'Welcome!'
        )
        with open(os.path.join(out_dir, 'index.html'), 'w') as f:
            f.write(html)

    def generate(self):
        """Export static site"""
        pass


if __name__ == '__main__':
    MySiteGenerator('build/')


# class SiteGenerator(object):
#     def __init__(self):
#         self.feeds = []
#         self.env = Environment(loader=FileSystemLoader('template'))
#         self.fetch_feeds()
#         self.empty_public()
#         self.copy_static()
#         self.render_page()

#     def fetch_feeds(self):
#         """ Request and parse all of the feeds, saving them in self.feeds """
#         for url in URLS:
#             print(f"Fetching {url}")
#             self.feeds.append(feedparser.parse(url))

#     def empty_public(self):
#         """ Ensure the public directory is empty before generating. """
#         try:
#             shutil.rmtree('./public') 
#             os.mkdir('./public')
#         except:
#             print("Error cleaning up old files.")

#     def copy_static(self):
#         """ Copy static assets to the public directory """
#         try:
#             shutil.copytree('template/static', 'public/static')
#         except:
#             print("Error copying static files.")

#     def render_page(self):
#         print("Rendering page to static file.")
#         template = self.env.get_template('_layout.html')
#         with open('public/index.html', 'w+') as file:
#             html = template.render(
#                 title = "Spiffy Feeds",
#                 feeds = self.feeds
#             )
#             file.write(html)


# if __name__ == "__main__":
#     SiteGenerator()