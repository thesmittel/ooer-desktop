/**
 * System Application: Terminal (WIP)<br>
 * This will soon include mostly documentation on the terminal itself, how commands are parsed and how to add new ones.
 * @file terminal.js
 * @author Smittel
 * @copyright 2024
 * @name Sysapp:Terminal
 * @see <a href="./sysapp.Sysapp_Terminal.html">Sysapp:Terminal</a>
 * @todo Text input
 * @todo Syntax highlighting
 * @todo command history, probably comes for free when the command is in a data attribute of a child of a bigger container
 * @todo these two require the same workaround as last time with manual in-code focussing of invisible textbox, putting text content of said textbox into a &lt;p> with syntax highlighting and ideally have the raw command be places in a data attribute of said &lt;p>
 * @todo implement first rudimentary commands
 * @todo filesystem
 * @todo parser for more complex operations like piping
 * @todo permissions
 */
/**
 * System Application: Terminal (WIP)<br>
 * This will soon include mostly documentation on the terminal itself, how commands are parsed and how to add new ones.
 * @file terminal.js
 * @author Smittel
 * @copyright 2024
 * @name Sysapp:Terminal
 * @see <a href="./sysapp.Sysapp_Terminal.html">Sysapp:Terminal</a>
 * @namespace SystemApplications
 * @requires Client:Auth
 * @requires Client:Util
 * @requires Client:Connect
 * @requires Client:App
 * @todo Text input
 * @todo Syntax highlighting
 * @todo command history, probably comes for free when the command is in a data attribute of a child of a bigger container
 * @todo these two require the same workaround as last time with manual in-code focussing of invisible textbox, putting text content of said textbox into a &lt;p> with syntax highlighting and ideally have the raw command be places in a data attribute of said &lt;p>
 * @todo implement first rudimentary commands
 * @todo filesystem
 * @todo parser for more complex operations like piping
 * @todo permissions
 */
/**
 * @module Terminal
 * @memberof sysapp
 * @description System Application: Terminal (WIP)<br>
 * This will soon include mostly documentation on the terminal itself, how commands are parsed and how to add new ones.
 * @name Sysapp:Terminal
 * @author Smittel
 * @requires Client:Auth
 * @requires Client:Util
 * @requires Client:Connect
 * @requires Client:App
 * @todo Text input
 * @todo Syntax highlighting
 * @todo command history, probably comes for free when the command is in a data attribute of a child of a bigger container
 * @todo these two require the same workaround as last time with manual in-code focussing of invisible textbox, putting text content of said textbox into a &lt;p> with syntax highlighting and ideally have the raw command be places in a data attribute of said &lt;p>
 * @todo implement first rudimentary commands
 * @todo filesystem
 * @todo parser for more complex operations like piping
 * @todo permissions
 */
/** 
 * @member "&lt;import>"
 * @name Import Syntax 
 * @summary To use Imports, put your imports at the top of the file like in the example. <code>"&lt;import&gt;"</code> and <code>"&lt;/import&gt;"</code> are used to mark said imports. This is critical, as otherwise, imports wont work. They need to be on separate lines. Note that some editors will autofill incorrect paths, using the local file system to determine relative paths. This obviously needs to be changed, the correct path is <code>/js/</code>, since everything on the clients end is relative to the <code>/public/</code> directory. Imports are only available for system applications, by design and definition. Non-system applications must not have the same level of access. Conversely, system apps often do need the access to system functionality.
 * @example "<​import>"
 * import { username } from "/js/modules/Auth.mjs"
 * import { getElement } from "/js/modules/Util.mjs"
 * import { App } from "/js/modules/Connect.mjs"
 * import { registerListener } from "/js/modules/App.mjs"
 * "<​/import>"
 * 
*/
"<import>"
import { username } from "/js/modules/Auth.mjs"
import { getElement } from "/js/modules/Util.mjs"
import { App } from "/js/modules/Connect.mjs"
"</import>"

const terminalinput   = getElement("terminal-input");
const terminallabel   = getElement("terminal-label");
const terminalcontent = getElement("terminal-past");
const terminalshow    = getElement("terminal-show")
const terminalbg      = getElement("terminal-bg")
const pathelement     = getElement("path");

function terminalMain() {
    

    let recentTerminalCommands = [];
    let recentIndex = -1;
    let usrnm = username();
    terminallabel.dataset.path = `@${usrnm}/Documents`; //This is the filepath
                                                        //Special directories: @sys, @username (where username is replaced by the username)
    terminalinput.dataset.rand = Math.round(Math.random() * 100000000);
    terminalinput.id = terminalinput.id + terminalinput.dataset.rand;
    terminallabel.id = terminallabel.id + terminalinput.dataset.rand;
    terminalshow.id = terminalshow.id + terminalinput.dataset.rand;
    terminalbg.id = terminalbg.id + terminalinput.dataset.rand;
    pathelement.id = pathelement.id + terminalinput.dataset.rand;
    pathelement.textContent = terminallabel.dataset.path
    terminalcontent.id = terminalcontent.id + terminalinput.dataset.rand;

    const terminalCursorStyle = get("terminal-cursor");
    terminalCursorStyle.id = terminalCursorStyle.id + terminalinput.dataset.rand;

    /**
     * Handles the live syntax highlighting
     * @param {string} input 
     * @returns {string} color formatted input
     */
    function syntax(input) {
        const validCommand = '#aeae34';
        const invalidCommand = '#ae3434';
        const argumentname = '#989898';
        const value = '#13a300';
        let tokens = input.split(" ");
        let validCommands = ["cd", "chdir", "say", "echo", "print", "clear", "cls", "cmd", "ls"]
        let command = tokens.shift();
        if (validCommands.includes(command)) {
            command = `<span style="color: ${validCommand} !important;">${command}</span>`
        } else {
            command = `<span style="color: ${invalidCommand} !important;">${command}</span>`
        }

        if (tokens.length > 0) {
            let full = tokens.join(" ");
            let argnames = full.match(/-{1,2}\S+?(?=\b)/g);
            let argvals = full.match(/(?<==)"[\s\S]+?"/g) 
            let argvals2 = full.match(/(?<==)[^"]+?(?=\b)/g)
            
            if (argnames) {
                argnames = argnames.sort((a,b)=> a.length<b.length);
                // console.log(argnames)
                for (let a of argnames) {
                    full = full.replaceAll(a, "\x00\x03\x01" + a + "\x02")
                }
            }
            
            
            if (argvals && argvals2) {
                if (argvals2) {
                    argvals = argvals.concat(argvals2)
                }
            } else {
                argvals = argvals2;
            }
            if (argvals) {
                argvals = argvals.sort((a,b)=> a.length<b.length);
                for (a of argvals) {
                    full = full.replaceAll(a, "\x00\x04\x01" + a + "\x02")
                }
            }
            
            full = full
                .replaceAll("\x00", '<span style="color: ')
                .replaceAll("\x01", ' !important;">')
                .replaceAll("\x02", '</span>')
                .replaceAll("\x03", argumentname)
                .replaceAll("\x04", value)

            return `${command} ${full}` 
        }
        return command
    }
   
    listen("terminal_res", ({res, fp, id}) => {
        if (id != terminalinput.dataset.rand) return;
        terminallabel.dataset.path = fp;
        let entry = document.createElement("p");
        if (res && res != "") {
            switch (res) {
                case "\e":
                    terminalcontent.textContent = "";
                    break;
                default:
                    entry.style = "line-height: 16px; margin: 0;";
                    entry.innerHTML = res;
                    terminalcontent.appendChild(entry);
            }
        }
        pathelement.textContent = terminallabel.dataset.path.replaceAll("/", "​/");
        terminalbg.scrollTop = terminalbg.scrollHeight;
    })
    terminalinput.addEventListener("input", (event) => {
        // console.log(event)
        pathelement.textContent = terminallabel.dataset.path.replaceAll("/", "​/");
        event.target.value = event.target.value.replaceAll("<","\x0E").replaceAll(">", "\x0F")
        setTimeout(()=>{terminalshow.innerHTML = syntax(event.target.value.replaceAll("\x0E","&lt;").replaceAll("\x0F", "&gt;"))}, 20)
    }) 
    
    function updateCursorPos() {
        let pos = terminalinput.selectionStart;
        return Math.max(0, Math.min(terminalinput.value.length - pos, terminalinput.value.length));
    }
    function setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }
    
    function setCaretToPos (input, pos) {
           setSelectionRange(input, pos, pos);
    }
    terminalinput.addEventListener("keydown", (event) => {
        if (event.key == "ArrowUp" && recentTerminalCommands.length > 0) {
            recentIndex = Math.min(recentIndex + 1, recentTerminalCommands.length-1)
            terminalinput.value = recentTerminalCommands[recentIndex] || "";
            setTimeout(() => {
                setCaretToPos(terminalinput, -1);
                updateCursorPos();
            }, 20);
            terminalshow.innerHTML = syntax(recentTerminalCommands[recentIndex] || "");
        }
        if (event.key == "ArrowDown" && recentTerminalCommands.length > 0) {
            recentIndex = Math.max(recentIndex - 1, -1)
            terminalinput.value = recentTerminalCommands[recentIndex] || ""
            setTimeout(() => {
                setCaretToPos(terminalinput, -1);
                updateCursorPos();
            }, 20);
            terminalshow.innerHTML = syntax(recentTerminalCommands[recentIndex] || "");
        }

        if(event.key == "ArrowLeft" ||event.key == "ArrowRight") {
            setTimeout(() => {
                terminalCursorStyle.innerHTML = `
                .terminal-show::after {
                    content: "_";
                    position: relative;
                    right: ${updateCursorPos()}ch;
                }`
            },20)
        }

        if (event.key == "Enter") {
            event.preventDefault();
            recentIndex = -1;
            if (terminalinput.value != "") {
                recentTerminalCommands.unshift(terminalinput.value)
            }
            
            window.send("terminal_req", {cmd: terminalinput.value, fp: terminallabel.dataset.path, id: terminalinput.dataset.rand})
            let entry = document.createElement("p");
            entry.style = "line-height: 14px; margin: 0;"
            entry.innerHTML = terminallabel.textContent + " " + syntax(terminalinput.value);
            terminalinput.value = "";
            terminalshow.textContent = "";
            terminalcontent.appendChild(entry)
            terminalbg.scrollTop = terminalbg.scrollHeight;
        }
    })

    let terminalWindowBody = terminalinput.parentNode.parentNode;
    terminalWindowBody.addEventListener("click", (event) => {
        terminalinput.focus();
    })
}

terminalMain();