/**
 * Server module: handles application requests
 * @file App.js
 * @author Smittel
 * @copyright 2024
 * @name Server:App
 * @see <a href="./client.Client_Auth.html">Server:App</a>
 * @requires fs
 * @requires url
 * @todo Replace user password storage with a database instead of a JSON
 */
/**
 * Server module: handles application requests
 * @file App.js
 * @author Smittel
 * @copyright 2024
 * @name Server:App
 * @see <a href="./server.Server_App.html">Server:App</a>
 * @namespace ServerCode
 * @requires fs
 * @requires url
 * @todo Replace user password storage with a database instead of a JSON
 */
/**
 * @module App
 * @memberof server
 * @description Server module: handles application requests
 * @name Server:App
 * @author Smittel
 * @requires fs
 * @requires url
 * @todo Replace user password storage with a database instead of a JSON
 */
import * as fs from "fs"
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

let appDB = JSON.parse(fs.readFileSync("./server/applications/custom/db.json"))

function grabApplication(socket, data) {
    console.log("grabApp")
    const id = data.id;
    const appDir = __dirname + "/applications/custom/" + id + "/"
    fs.readFile(appDir + "config.json" , (err, res) => {
        let config = JSON.parse(res)
        let count = 3 * config.windows.length;

        const scripttemplate = [`
const setInterval = () => {throw new Error("Intervals are forbidden")};
const globalThis = {};self = {};frames = {}
"<application>"
const body = globalGetElementById(application.bodyid)
const socket = {}
const document = {
    getElementById: (str) => {
        return globalGetElementById(application.windowid).querySelector("#" + str)
    },
    create: (str) => {
        return globalCreate(str)
    }
};`,
["", `const window = globalGetElementById(application.windowid);`],
`const getParent = (e, n = 1) => {
    if (e == undefined) {
        throw new ValueError("element is undefined")
    }
    for (let i = 0; i < n; i++) {
        try {
            if (e.parentNode == document.getElementById(application.windowid)) return e;
            e = e.parentNode;
        } catch (err) {
        }
    }
    return e;
};`,
        ]
        /**
         * This abomination removes all evals in their entirety with symmetrical parenthesis, as well as other important things. Overriding them would probably be better, but that wont work for parentNode for example.
         * @member Reggie
         * @name Internal:Reggie
         * @type RegExp
         * @returns { RegExp }
         */
        const reggie = () => /([^;\n]*?(eval *?\([^)(]*(?:\([^)(]*(?:\([^)(]*(?:\([^)(]*\)[^)(]*)*\)[^)(]*)*\)[^)(]*)*\))|((?<=;|\n)[^;\r\n]*?((previous(Element)?Sibling)|(parent(Element|Node)|ownerDocument)).*?[;|\r?\n]))/gi;
        function cbj(res, n, file) {
            let ret = res.toString().replaceAll(reggie, "");
            ret = scripttemplate[0] + (scripttemplate[1][appDB[id].permissions] || "") + scripttemplate[2] + ret;
            cb(ret, n, file)
        }
        function cb(res, n, file) {
            // if (file == "js") {
            //     res = res.toString().replace(/ +/g, " ").replace(/(\t)/g, "").replace(/(\r?\n)/g, ";")
            // }
            
            config.windows[n][file] = res.toString();
            count--;
            if (!count) send()
        }
    console.log(appDB[id].permissions)
        for (let w = 0; w < config.windows.length; w++) {
            fs.readFile(appDir + config.windows[w].html, (err, res)=>{cb(res, w, "html")})
            fs.readFile(appDir + config.windows[w].js, (err, res)=>{cbj(res, w, "js")})
            fs.readFile(appDir + config.windows[w].css, (err, res)=>{cb(res, w, "css")})
        }
        
        
        function send() {
            for (let w = 0; w < config.windows.length; w++) {
                config.windows[w].html = config.windows[w].html.toString().replace(/<\s*?script[\w\W]*?>[\w\W]*?<\/script>/gi, "")
            }
            // config.windows[0].js = `function getScriptWorker(foo) {return window.URL.createObjectURL(new Blob([foo], {type: "text/javascript"}))};function protectCode(code) {let worker  = new Worker(getScriptWorker(code))};protectCode(${config.windows[0].js.replace(/\r/g, "")})`;
            // 
            // config.windows[0].js = config.windows[0].js.replace(/([^;\n]*?((document)|(process)|(window))(\n*).*?(;|\n|$)|(eval\([^)(]*(?:\([^)(]*(?:\([^)(]*(?:\([^)(]*\)[^)(]*)*\)[^)(]*)*\)[^)(]*)*\))|[^\n].*?parentNode.*?(;|$|\n))/gi, "")
            // (?<=;|\n)[^;\n]*?((previous(Element)?Sibling)|(parent(Element|Node)|ownerDocument)).*?[;|\n]
            let appObj = {
                config: {
                    windows: config.windows,
                    type: config.type,
                    version: config.version,
                    name: config.name,
                    author: config.author,
                    resizable: config.resizable
                },
                icon: `/media/desktopicons?i=${id}`,
                id: id,
                permissions: appDB[id].permissions
            }
            socket.emit("App", {response: "start_app", data: appObj})
        }
        
        
    })
}

export {grabApplication}