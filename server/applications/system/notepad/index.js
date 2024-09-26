let closeDialogOpen = false;
let notepadtextarea;
let lastSave = "";
function closeNotepad(event) {
    if (notepadtextarea.value == lastSave) document.closeApplication(event);
    // Overwriting the close button behaviour
    function closeDialog(darken) {
        darken.remove();
        closeDialogOpen = false;
    }
    function save(event, darken) {
        // Save dialog (too lazy to make now)
        // Needs explorer variant anyways
        // And that needs a proper folder structure
        // Not even close to wanting to deal with that
        // So this will have to wait a while, it does make the request but it gets ignored
        window.send("io", {
            request: "app.notepad.filesave",
            data: notepadtextarea.value
        })
        document.closeApplication(event)
        return;
    }
    if (!closeDialogOpen) {
        closeDialogOpen = true;
        const darken    = document.createElement("div");
        const container = document.createElement("div");
        const text      = document.createElement("div");
        const buttons   = document.createElement("div");
        const btnSave   = document.createElement("a")
        const btnDont   = document.createElement("a")
        const btnCanc   = document.createElement("a")
        btnSave.dataset.default = "true"
        btnSave.innerText = "Save";
        btnDont.innerText = "Don't save";
        btnCanc.innerText = "Cancel";
        btnCanc.addEventListener("click", ()=> {closeDialog(darken)})
        btnDont.addEventListener("click", document.closeApplication);
        btnSave.addEventListener("click", (event)=> {save(event, darken)})
        buttons.append(btnSave, btnDont, btnCanc)
        buttons.classList.add("buttonsCont")
        text.classList.add("text")
        text.innerHTML = "There are unsaved changes.<br>Do you want to save?"
        darken.classList.add("closeDialog")
        container.append(text, buttons)
        darken.append(container)
        try {
            getParent(event.target, 3).children[2].append(darken);
        } catch (e) {

        }
        
    }
    return
    // document.closeApplication(event)
}
function notepadSetup() {
    const rand = Math.floor(Math.random()*100000)
    const notepadnavbar = document.getElementById("notepad-options-bar");
    notepadnavbar.id = notepadnavbar.id + rand;
    notepadtextarea = document.getElementById("notepadtextarea");
    notepadtextarea.id = notepadtextarea.id + rand;

    const wind = notepadnavbar.parentNode.parentNode
    const windBtn = wind.querySelector("#" + wind.id + "controls").children[0]
    
    const newBtn = document.createElement("window-button")
    newBtn.dataset.action = "close";
    newBtn.dataset.id = wind.id;
    newBtn.addEventListener("click", closeNotepad)
    windBtn.parentNode.replaceChild(newBtn, windBtn)

    notepadtextarea.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
          this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);
      
          // put caret at right position again
          this.selectionStart =
            this.selectionEnd = start + 1;
        }
      });
    
    for (let i = 0; i < notepadnavbar.children.length; i++) {
        notepadnavbar.children[i].addEventListener("click", notepadmenutoggle)
    }

    
    
    notepadnavbar.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", notepadSubButtonClicked)
    })

    
    
    function notepadSubButtonClicked(e) {
        e.stopPropagation()
        e.target.parentNode.dataset.active = "false"
        let action = e.target.dataset.action;
    }
    
    function notepadmenutoggle(e) {
        if (e.target.tagName == "HR" || e.target.dataset.closeonfocus == "true") return
        Array.from(e.target.parentNode.children)
            .filter(a => a != e.target)
            .map(a => a.children[0])
            .forEach(a => a.dataset.active = "false")
    
        e.target.querySelector("div").dataset.active = (
            e.target.querySelector("div").dataset.active == "false"
        )
    }
}
notepadSetup();