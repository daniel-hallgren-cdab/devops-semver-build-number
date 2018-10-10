'use strict'

const azdev = require('azure-devops-node-api')

async function run (project, orgUrl, token, definitionId, version) {
  try {
    if (project == null || orgUrl == null || token == null || definitionId == null) {
      throw new Error('You must specify a DevOps `project` name, `orgUrl`, PAT `token`, build `definitionId`!')
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
