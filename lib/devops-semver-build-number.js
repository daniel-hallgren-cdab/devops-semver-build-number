'use strict'

const azdev = require('azure-devops-node-api')

async function run (project, orgUrl, token, definitionId, version) {
  try {
    if (project == null) {
      throw new Error('You must specify a DevOps `project` name!')
    }
    if (orgUrl == null) {
      throw new Error('You must specify a DevOps `orgUrl`!')
    }
    if (token == null) {
      throw new Error('You must specify a DevOps PAT `token`!')
    }
    if (definitionId == null) {
      throw new Error('You must specify a DevOps build `definitionId`!')
    }

    const authHandler = azdev.getPersonalAccessTokenHandler(token)
    const connection = new azdev.WebApi(orgUrl, authHandler)

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

module.exports = run
