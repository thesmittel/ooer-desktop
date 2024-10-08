const isBrowser = globalThis.process===undefined;
const path = isBrowser?{resolve: () => {return "{{SERVER}}"}}:require("node:path")
const configPath = isBrowser ? "{{SERVER}}":(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"))  + "/.smittel"
const installPath = isBrowser?"{{SERVER}}":path.resolve(".")

export { isBrowser, configPath, installPath }
