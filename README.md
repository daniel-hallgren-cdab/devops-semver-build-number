# @daniel-hallgren-cdab/devops-semver-build-number

[![npm (scoped)](https://img.shields.io/npm/v/@daniel-hallgren-cdab/devops-semver-build-number.svg)](https://github.com/daniel-hallgren-cdab/devops-semver-build-number)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@daniel-hallgren-cdab/devops-semver-build-number.svg)](https://github.com/daniel-hallgren-cdab/devops-semver-build-number)


This package makes sure your build numbers in Azure DevOps correspond to your project's version number, as well as adding build metadata in accordance with SemVer formatting.

Your build numbers will look like this: `2.1.6+734.20181013.2`, according to this structure: `VERSION_NUMBER+BUILD_ID.DATE.REVISION`.


## Install

### Yarn
```console
$ yarn add -D @daniel-hallgren-cdab/devops-semver-build-number
```

### npm
```console
$ npm install -D @daniel-hallgren-cdab/devops-semver-build-number
```


## Usage

To use `devops-semver-build-number` there are a few steps you need to take:

1. Add build script to `package.json`
0. Add pipeline variables to Azure DevOps Build Pipeline
0. Set the Build number format in Azure DevOps Build Pipeline options
0. Add `.env`-file to the Azure DevOps Agent, at build time
0. Allow scripts to access the OAuth token in DevOps
0. Add Yarn task (or npm task) to your Azure DevOps Build Pipeline



### 1. Add build script to `package.json`
```json
{
  "scripts": {
    "devops-semver": "devops-semver-build-number --pwd $(pwd)",
  }
}
```



### 2. Add necessary pipeline variables to Azure DevOps Build Pipeline

1. Head over to your build pipeline in Azure DevOps, and click edit
0. Go to the "Variables"-tab and select "Pipeline variables" in the side menu
0. Add a variable called `ORG_NAME`, with the value being your DevOps Organization's name. You can find this in your DevOps URL: `https://dev.azure.com/{ORG_NAME}/` if unsure

These steps are optional, but are required if you want to add build metadata in SemVer formatting to your build number

4. Add a variable called `DOT`, with the value `.` (a single dot)
0. Add a variable called `PLUS`, with the value `+` (a single plus sign)



### 3. Set the Build number format in Azure DevOps Build Pipeline options

1. Go to the "Options"-tab (in your Build Pipeline's edit view)
0. Set the value of the field "Build number format" to `$(VERSION)$(PLUS)$(BuildID)$(DOT)$(date:yyyyMMdd)$(rev:.r)`

If you're wondering where `$(VERSION)` comes from, that's a pipeline variable added automatically by `devops-semver-build-number` when you run the build script above.



### 4. Add `.env`-file to the Azure DevOps Agent, at build time

`devops-semver-build-number` needs some info about your project in Azure DevOps, as well as a token to authenticate with. We add these values to environment variables inside a `.env`-file, in the directory where `devops-sember-build-number` will be run, which is on the DevOps Agent in this case.

In your DevOps Build Pipeline, add a Command Line task to your Agent job. If you already create an `.env`-file during your build, then you could probably fuse these. Give the Command Line task the following script:

```bash
rm .env   # Removes previous .env-file, if cached with old data, as we rewrite it

# Variables to be used by devops-semver-build-number
echo DEVOPS_ACCESS_TOKEN=$SYSTEM_ACCESSTOKEN >> .env  # Value provided by DevOps
echo DEVOPS_ORG_NAME=$ORG_NAME >> .env                # A custom pipeline variable
echo DEVOPS_PROJECT_NAME=$SYSTEM_TEAMPROJECT >> .env  # Value provided by DevOps

# My other environment variables
# ... (the rest of your .env-file, if already existing)
```



### 5. Allow scripts to access the OAuth token in DevOps

This is really important. In order to use the `SYSTEM_ACCESSTOKEN` variable in our `.env`-file we must specifically allow this in the config of our Agent job in DevOps.

1. Go to the "Tasks"-tab (in your Build Pipeline's edit view)
0. Click directly on the Agent job.
0. Expand the "Additional options"-section at the very bottom
0. Check the "Allow scripts to access the OAuth token" checkbox



### 6. Add Yarn (or npm) task to Azure DevOps Build Pipeline

This is where we actually use `devops-semver-build-number` in our Build Pipeline.

A thing to note is to put this task *after* the installation of Node, Yarn (or npm) and running `yarn install` (or `npm install`), but *before* creating your actual project build via `yarn build` (or `npm run build`).

#### Project Directory (or "Working folder with package.json" in case of npm task)

This indicates where to run the Yarn (or npm) task, so this is your sources directory.

```
$(Build.SourcesDirectory)/
```

#### Arguments (or "Command" in case of npm task)

Here we run our build script! It's important to add the `--definition-id` parameter, as this provides `devops-semver-build-number` with the correct build pipeline's id.

##### Yarn task
```console
devops-semver --definition-id $(system.definitionId)
```

##### npm task
```console
run devops-semver --definition-id $(system.definitionId)
```



### 7. There is no step 7, you're good to go!

Next time you queue a build in Azure DevOps, your project's version number will be sent to DevOps and be used in the Build number of your build!



## Questions, suggestions or bug reports?

Just create an issue or Pull Request and I will have a look!
