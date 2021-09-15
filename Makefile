# from: https://earthly.dev/blog/python-makefile/

VENV = venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip

BUILD = build

$(VENV)/bin/activate: requirements.txt
	virtualenv $(VENV)
	$(PIP) install -r requirements.txt

build: $(VENV)/bin/activate
	$(PYTHON) generator.py

deploy: build
	git add build/*
	git commit -m "auto-build"
	git subtree push --prefix $(BUILD) origin gh-pages

clean:
	rm -rf __pycache__
	rm -rf $(VENV)