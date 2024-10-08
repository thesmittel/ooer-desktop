
class Application {
    #permissions = {};
    type;
    id;
    instances = {}; 

    constructor({ js, html, css, id, permissions, type }) {

    }

    #parsePermissions(p) {
        const names = [
            "UPDATE_CONTENT",
            "SUMMON_WINDOW",
            "OPEN_DIALOG",
            "OVERRIDE_WINDOW",
            "SERVER_COMMUNICATION",
            "READ_NOTIFICATIONS",
            "SEND_NOTIFICATIONS",
            "ACCESS_CONTACTS",
            "READ_USERNAME",
            "CHANGE_USERNAME",
            "READ_NICKNAME",
            "CHANGE_NICKNAME",
            "READ_SETTINGS",
            "CHANGE_SETTINGS",
            "ACCESS_LOCAL_FILES",
            "ACCESS_CLOUD_FILES",
            "MAKE_GLOBAL_SHORTCUT"
        ]
        for (let i = 0; i < names.length; i++) {
            this.#permissions[names[i]] = (p & i == 1)
            p >>= 1;
        }
    }
}