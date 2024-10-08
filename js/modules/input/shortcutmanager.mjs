// this is where apps will register shortcuts, they are cross checked for compatibility with system shortcuts
// different apps can have the same shortcut as another app, only the active (focussed) app will trigger.
// Apps with sufficient permissions can register global shortcuts
// This module will also provide the settings app with a list of all registered shortcuts for all registered apps to be customised by the user

const shortcuts = {}
/*
key         keyCode
Escape      27
Tab         9
shift       16
*/
const dummy = {
    appid: {
        "":""
    }
}