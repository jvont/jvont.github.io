#!/bin/sh

# script to
# from: https://gist.github.com/cobyism/4730490

if [ -z "$1" ]; then
  echo "Which folder do you want to deploy to GitHub Pages? "
  read dir
else
  dir=$1
fi
git subtree push --prefix $1 origin gh-pages