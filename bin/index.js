#!/usr/bin/env node

'use strict'

require('dotenv').config()

const args = require('yargs').argv

if (args.pwd == null) {
  throw new Error('You must specify a `pwd`, the folder/directory containing a package.json, your project\'s root folder')
}

const version = require(args.pwd + '/package.json').version

const project = process.env.DEVOPS_PROJECT
const orgUrl = process.env.DEVOPS_ORG_URL
const token = process.env.DEVOPS_TOKEN

const definitionId = args['definition-id']

const run = require('../lib/devops-semver-build-number')

run(project, orgUrl, token, definitionId, version)
