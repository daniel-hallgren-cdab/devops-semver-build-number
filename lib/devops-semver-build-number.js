'use strict'

const azdev = require('azure-devops-node-api')

async function run (projectName, organisationName, patToken, accessToken, definitionId, version) {
  try {
    if (projectName == null) {
      throw new Error('You must specify a DevOps `projectName`!')
    }
    if (organisationName == null) {
      throw new Error('You must specify a DevOps `organisationName`!')
    }
    if (patToken == null && accessToken == null) {
      throw new Error('You must specify a DevOps `patToken` or an `accessToken`!')
    }
    if (definitionId == null) {
      throw new Error('You must specify a DevOps build `definitionId`!')
    }

    let authHandler
    if (patToken) {
      authHandler = azdev.getPersonalAccessTokenHandler(patToken)
    } else if (accessToken) {
      authHandler = azdev.getBearerHandler(accessToken)
    } else {
      throw new Error('Something went wrong whilst authenticating. Ensure you pass either a `patToken` or an `accessToken`.')
    }

    const connection = new azdev.WebApi(organisationName, authHandler)

    const build = await connection.getBuildApi()

    const buildDefinition = await build.getDefinition(definitionId, projectName)
    
    buildDefinition.variables = {
      ...buildDefinition.variables,
      VERSION: {
        allowOverride: false,
        isSecret: false,
        value: version
      }
    }

    await build.updateDefinition(buildDefinition, definitionId, projectName)
  } catch (err) {
    console.log(err)
  }
}

module.exports = run
