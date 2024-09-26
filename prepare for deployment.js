import * as fs from "fs"

const suffix = () => /\.(css|m?js)$/g
const comment = () => /(\/\*.*?\*\/)|(\/{2,}.*?(\n|$))/gs
// create output folder
fs.mkdir("./deploy")
// function (directory)
    // if output folder: abort
    // readdir
    // get subdirectories
    // for all subdirectories
        // call function with subdirectory
    // get all files
    // for all files:
        // matches suffix?
            // read content
            // remove comments, especially jsdoc
        // save file into output folder with same relative path as original file