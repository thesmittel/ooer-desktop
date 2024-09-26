let test = document.create("div")
test.classList.add("testdiv")
body.append(test)
let test2 = document.create("div")
test2.classList.add("testdiv2")
test.append(test2)
document.getElementById("examplebutton").addEventListener("click", () => { alert("ooo :joy:") })
console.log("globalThis", globalThis) // Why are these
console.log("frames", frames)     // the same
console.log("self", self)       // object???
console.log("window", window)     // This one was modified to be the window of the app itself instead of the global window property
console.log("document", document)   // This allows access to local DOM elements
console.log("parent test", test.parentNode)
// setInterval(() => {
//     console.log("test")
// }, 103);
// Reason for this workaround is that WebWorkers do not have access to DOM at all.



