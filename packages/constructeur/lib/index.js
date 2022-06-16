#!/usr/bin/env node

const { CAC } = require('cac')

const { apply: build } = require('./build')

const cac = new CAC('constructeur')

build(cac)

cac.help().parse()
