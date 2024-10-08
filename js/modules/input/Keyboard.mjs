document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

function handleKeyDown(e) {
    // e.preventDefault();
    switch (e.key) {
        case "Control": {
            if (e.location == 1) { L_CTRL = true; }
            if (e.location == 2) { R_CTRL = true; }
            return;
        }
        case "Escape": {
            ESC = true;
            return
        }
        case "Tab": {
            TAB = true;
            return
        }
        case "Alt": {
            ALT = true;
            return;
        }
        case "AltGraph": {
            ALT_GR = true;
            return;
        }
        case "ContextMenu": {
            CTX = true;
            return
        }
        case "Shift": {
            if (e.location == 1) { L_SHIFT = true; }
            if (e.location == 2) { R_SHIFT = true; }
            return;
        }
    }
}

function handleKeyUp(e) {
    switch (e.key) {
        case "Control": {
            if (e.location == 1) { L_CTRL = false; }
            if (e.location == 2) { R_CTRL = false; }
            return;
        }
        case "Escape": {
            ESC = false;
            return
        }
        case "Tab": {
            TAB = false;
            return
        }
        case "Alt": {
            ALT = false;
            return;
        }
        case "AltGraph": {
            ALT_GR = false;
            return;
        }
        case "ContextMenu": {
            CTX = false;
            return
        }
        case "Shift": {
            if (e.location == 1) { L_SHIFT = false; }
            if (e.location == 2) { R_SHIFT = false; }
            return;
        }
    }
}

let ALT     = false;
let L_SHIFT = false;
let R_SHIFT = false;
let L_CTRL  = false;
let R_CTRL  = false;
let TAB     = false;
let ESC     = false;
let ALT_GR  = false;
let CTX     = false;
let PRINT   = false;
let SCROLL  = false;
let PAUSE   = false;
let F1      = false;
let F2      = false;
let F3      = false;
let F4      = false;
let F5      = false;
let F6      = false;
let F7      = false;
let F8      = false;
let F9      = false;
let F10     = false;
let F11     = false;
let F12     = false;


export { ALT, ALT_GR, L_CTRL, R_CTRL, TAB, ESC, R_SHIFT, L_SHIFT, CTX }
