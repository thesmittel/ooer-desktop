import { ContextMenu } from "../ui.mjs";
import { randomId } from "../Util.mjs";

class Window {
    element;
    #header;
    #body;
    #style;
    #taskbaricon;
    #app;
    #icon;
    #window_id;
    constructor(App, {title, iconURL, html, js, css, width, height, minWidth, minHeight}) {
        this.#window_id = randomId(12);
    }
}

class WindowHeader {
    element;
    #icon;
    #title;

    constructor(window, title, appId, instanceId, windowId, iconURL) {
        this.element = create({
            tagname: "div",
            id: `window-${appId}-${instanceId}-${windowId}-header`,
            classList: ["window-header"],
            dataset: {
                stopCtxPropagation: "true",
            }
        })
    }
}

class WindowHeaderIcon {
    element;
    #contextMenu;
    /**
     *
     * @param {Window} window
     * @param {String} iconURL
     * @param {String} title
     * @param {Object} contextmenu
     */
    constructor(window, iconURL, title, contextmenu) {
        let ctxMenu = [
            {type: "title", label: title},
            {type: "divider"},
            {type: "list", items: [
                {label: "Close", symbol: "bx-x", handler: window.close},
                {label: "Minimise", symbol: "bx-chevron-down", handler: window.minimise},
                {label: "Maximise", symbol: "bx-window", handler: window.maximise}
            ]},
            {type: "divider"},
            {type: "list", items: [
                {label: "About", symbol: "bx-info", handler: window.showAbout}
            ]}
        ];
        if (contextmenu && contextmenu.length > 0) ctxMenu.push({"type": "divider"}, contextmenu)

        this.#contextMenu = new ContextMenu(this.element, ctxMenu)
    }
}
