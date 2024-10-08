import { isBrowser, installPath } from "./system/Environment.mjs";
/**
 * Loads all js files (mjs, cjs included), importing them, putting them into an object that gets returned.
 * This simplifies modifications to the code tremendously, since elements can be added and deleted on the fly.
 * A downside is that it is not intellisense compatible.
 * The object will look as follows:
 * Modules exporting more than one class:
 * _name property gets ignored unless _namespace is also set, the result will be
 * {
  * <_namespace>: {
  *  <_name>: {
  *    classes
  *  }
  * }
 * }
 *
 * @param {String} path
 * @returns
 */
async function load(path) {
  if (isBrowser) {
    // will figure it out
    return {}
  } else {
    const fs = require("node:fs")
    const nodepath = require("node:path")
    if (fs.statSync(path).isFile()) throw new Error("Must be directory")
    const moduleFilter = /^.*(?=\.[mc]?js$)/g;
    const elements = fs.readdirSync(path).filter(a => a.match(moduleFilter))
    const total = elements.length;
    const OBJ = {};
    for (let e of elements) {
      const name = e.match(moduleFilter)[0]
      const isFile = fs.statSync(path + "/" + e).isFile()
      if (isFile) {
        let module = await import(`file:///${nodepath.resolve(path)}/${e}`)
        let moduleName = ((typeof module._name === "string" && module._name != "") ? module._name : undefined);
        let moduleNamespace = (module._namespace)
        let classes = Object.keys(module).filter(a => (a != "_name" && a != "_namespace"));

        if (classes.length == 0) continue; // Skip modules that dont provide any exports (They still get imported, ill make that optional in the future)

        let selected = OBJ;
        if (moduleNamespace) {
          if (OBJ[moduleNamespace]?.constructor.name == "Function") error(path, moduleNamespace)
          OBJ[moduleNamespace] = OBJ[moduleNamespace] || {}
          selected = OBJ[moduleNamespace]
        }

        if (moduleName) {
          if (OBJ[moduleName]?.constructor.name == "Function") error(path, moduleNamespace, moduleName || name)
          selected[moduleName || name] = selected[moduleName || name] || {};
          selected = selected[moduleName || name]
        }

        for (let c of classes) {
          if (selected[c]) error(path, moduleNamespace, moduleName || name, c)
          selected[c] = module[c]
        }
        // console.log("OBJK", {...OBJ})
      }
    }
    return OBJ;
  }
}

function error(path, namespace, name, c) {
  throw new Error(`Namespace collision (${path}): ${namespace?namespace:""}${name?"." + name:""}${c?"."+c:""}`);

}

export { load }
