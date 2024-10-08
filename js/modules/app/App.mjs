import { App as requestApp, System as requestSysApp } from "../Connect.mjs";
import { randomId } from "../Util.mjs";
import { registerListener } from "./AppManager.mjs";
class App {
    #instanceId;
    #isSystemApp;
    #communicate;
    constructor(appId, isSystemApp) {
        this.#instanceId = randomId(12);
        this.#isSystemApp = isSystemApp;
        this.#communicate = isSystemApp?requestSysApp:requestApp;
        registerListener(appId, this.#instanceId, this.receiveAppData)
    }

    get instanceID() {
        return this.#instanceId;
    }
    get receiveAppData() {
        return this.#receiveAppData;
    }

    #receiveAppData(data) {

    }

    #sendAppData(data) {
        this.#communicate({request: "put", data: data})
    }
}

export { App }
