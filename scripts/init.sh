#!/bin/bash
set -e

# Register remote url
# Usage:
#  remote <name> <url>
function register() {
    git remote add -f $1 $2
}

register constructeur https://github.com/AwesomeHamster/constructeur.git
register core https://github.com/AwesomeHamster/core.git
register plugin-eorzea https://github.com/AwesomeHamster/koishi-plugin-ffxiv-eorzea.git
register plugin-hitokoto https://github.com/AwesomeHamster/koishi-plugin-hitokoto.git
register plugin-lodestone https://github.com/AwesomeHamster/koishi-plugin-ffxiv-lodestone.git
register plugin-macrodict https://github.com/AwesomeHamster/koishi-plugin-ffxiv-macrodict.git

# Clean up
unset -f register
