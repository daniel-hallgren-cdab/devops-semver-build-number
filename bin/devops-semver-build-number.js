#! /usr/bin/env node

'use strict'

require('dotenv').config()

const args = require('yargs').argv

const azdev = require('azure-devops-node-api')

if (args.pwd == null) {
  throw new Error('You must specify a `pwd`, the folder/directory containing a package.json, your project\'s root folder')
}

const packageJson = require(args.pwd + '/package.json')

const project = process.env.DEVOPS_PROJECT
const orgUrl = process.env.DEVOPS_ORG_URL
const token = process.env.DEVOPS_TOKEN

const definitionId = args['definition-id']

const version = packageJson.version

if (project == null || orgUrl == null || token == null || definitionId == null) {
  throw new Error('You must specify a DevOps `project` name, `orgUrl`, PAT `token`, build `definitionId`!')
}

async function run (project, orgUrl, token, definitionId, version) {
  const authHandler = azdev.getPersonalAccessTokenHandler(token)
  const connection = new azdev.WebApi(orgUrl, authHandler)

  try {
    const build = await connection.getBuildApi()

    const buildDefinition = await build.getDefinition(definitionId, project)
    
    buildDefinition.variables = {
      ...buildDefinition.variables,
      VERSION: {
        allowOverride: false,
        isSecret: false,
        value: version
      }
    }

    await build.updateDefinition(buildDefinition, definitionId, project)
  } catch (err) {
    console.log(err)
  }
}

module.exports = run(project, orgUrl, token, definitionId, version)
