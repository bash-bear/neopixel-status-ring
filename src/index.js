const utils = require("./utils")
const constants = require("./constants")
const defaultConfig = require("./config.json")

module.exports = {
    defaultConfig,
    ...utils,
    ...constants
}