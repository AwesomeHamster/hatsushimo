const { CAC } = require('cac')

const { apply: build } = require('./build')

const cac = new CAC('consructeur')

build(cac)

cac.parse()
