# from: https://earthly.dev/blog/python-makefile/

SHELL := /bin/bash

venv/bin/activate: requirements.txt
	virtualenv venv
	./venv/bin/pip install -r requirements.txt

build: venv/bin/activate
	./venv/bin/python generator.py

deploy: build
	git subtree push --prefix build origin gh-pages

clean:
	rm -rf __pycache__
	rm -rf venv