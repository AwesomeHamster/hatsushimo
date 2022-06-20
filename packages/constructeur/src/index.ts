#!/usr/bin/env node

import { CAC } from 'cac'

import { apply as build } from './build'

const cac = new CAC('constructeur')

build(cac)

cac.help().parse()
