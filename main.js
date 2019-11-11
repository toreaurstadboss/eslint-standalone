/* You might want to check first if the file exists and stuff but this is an example. */
const fs = require('fs')
module.exports = function(filePath) {
    let data = fs.readFileSync(filePath).toString() /* open the file as string */
    let object = JSON.parse(data) /* parse the string to object */
    return JSON.stringify(object, false, 3) /* use 3 spaces of indentation */
}