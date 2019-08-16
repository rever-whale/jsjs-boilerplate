const request = require('superagent')
const fs = require('fs')
const path = require('path')
const admZip = require('adm-zip')
const filePath = process.argv[2] || ''
const shell = require('shelljs')

const repoName = 'webpack-boilerplate'
const href = `https://github.com/rever-whale/${repoName}/archive`
const zipFile = 'master.zip'
const source = `${href}/${zipFile}`
const extractEntryTo = `${repoName}-master/`
const outputDir = path.resolve(filePath)
const zipFilePath = path.resolve(zipFile)

console.log('[href]', href);
console.log('[source]', source);
console.log('[extractEntryTo]', extractEntryTo);
console.log('[outputDir]', outputDir);
console.log('--------------------------------------------------')

console.log('[step1] start download')
request
    .get(source)
    .on('error', err => {
        console.log(err)
    })
    .pipe(fs.createWriteStream(zipFile))
    .on('finish', function () {
        //code
        console.log('[step2] finish-download')
        const zip = new admZip(zipFile)
        console.log('[step3] start unzip')
        zip.extractEntryTo(extractEntryTo, outputDir, false, true)
        fs.unlinkSync(zipFilePath)
        console.log('[step4] finished unzip & delete tmp zip')
        console.log('[step5] install npm module')
        shell.exec(`cd ${outputDir} && npm install`)
        console.log('[step6] complete')
    })
