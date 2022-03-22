import CAC from 'cac'

import { apply as build } from './build'

const cac = CAC('consructeur')

build(cac)

cac.parse()
