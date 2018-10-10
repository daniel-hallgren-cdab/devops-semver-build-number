#!/usr/bin/env node

'use strict'

require('dotenv').config()

const args = require('yargs').argv

if (args.pwd == null) {
  throw new Error('You must specify a `pwd`, the folder/directory containing a package.json, your project\'s root folder')
}

const version = require(args.pwd + '/package.json').version

const projectName = process.env.DEVOPS_PROJECT_NAME
const organisationName = process.env.DEVOPS_ORG_NAME
const patToken = process.env.DEVOPS_PAT_TOKEN
const accessToken = process.env.DEVOPS_ACCESS_TOKEN

const definitionId = args['definition-id']

const run = require('../lib/devops-semver-build-number')

run(projectName, organisationName, patToken, accessToken, definitionId, version)
