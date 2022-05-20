#!/bin/bash
set -e

# Push subtree to github
# Usage:
#   push <directory> <remote> [branch]
function push() {
    local branch
    branch="master"
    if [ -n "$3" ]; then
        branch=$3
    fi
    echo "  ---> Pushing $1 to $2:$branch"
    git subtree push --prefix=$1 $2 $branch
}

echo "  ---> Pushing hatsushimo to origin"
git push
## push every subtree to github
push packages/constructeur constructeur
push plugins/eorzea plugin-eorzea
push plugins/hitokoto plugin-hitokoto
push plugins/lodestone plugin-lodestone
push plugins/macrodict plugin-macrodict

# Clean up
unset -f push
