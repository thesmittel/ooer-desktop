
## Version

0.1.240918
- 3 new server events
    - 2 outgoing ("password-prompt-incorrect" and "password-prompt-correct")
    - 1 incoming ("password-confirmation")
    - These are used by the new PasswordPrompt element for actions that require the users password after logging in
- Password prompt functional
- (Un-)Locking desktop symbols now requires a password
- Small change to the window dragging module, will slowly be migrated towards a new data attribute based approach which gives more granular control over which elements can be used to move an element
- Fixed bug related to desktop edit mode
- New NumberBox element
    - A textbox accepting only numbers (digits 0-9 and decimal point)
    - Buttons for incrementing the value
    - Holding shift while pressing the +/- button increments by 10
    - Holding ctrl while pressing increments by 0.1
    - Shift ALWAYS overrides ctrl
    - takes default value and optional min/max values
    - fires "update" event

## Known issues:
- Windows ignore panels entirely
- Multi desktop not tested
- Panels have no applets
- Code is a mess
- Selector box doesnt select anything


## Why such a weird version numbering?
It's in early development. I took a long break from the project, when i came back, a lot was already present, so im assuming this to be `0.1`. However, since then, not enough has changed to warrant a new number, so i use the date in YYMMDD format to differenciate the progress.

## Dev Diary

### 0.1.240914
- Started rewriting some parts to be more debuggable
    - mostly involving getter and setter functions
- fixed severe bugs that somehow materialised from that
- DynamicString class:
    - a more dynamic string template
    - gets passed strings and references to objects and names of properties
    - A DynamicString is defined *once*
    - When it is printed with *instance*.string - no parentheses - all properties will be printed according to their value at the point of printing
    - For classes, this only works if the property being accessed is public or has a getter
    - Allows for accessing individual elements in objects, arrays and strings as well
    - As of now, these properties can only be printed as they are, im working on ways to manipulate them afterwards

### 0.1.240913
- Desktop now has a dedicated edit mode
    - Can be activated by right-clicking empty parts of the desktop and choosing "Edit Desktop"
    - Entering edit mode like this means you can make as many changes as you want, open and close the panel dialogs, and stay in edit mode
- Panels can now be locked, you can not make any changes to a locked panel until you unlock it again
- Changed the way edit mode is achieved
- Small fixes
- Realised i cant keep distracting myself with making a pretty UI and should start focussing on making it functional at some point
- immediately disregarded that realisation

### 0.1.240911
- The old taskbar is currently hidden, so the start menu is only available if you inspect the source and make it visible manually. (Shift+Rightclick)
- The old clock widget was removed entirely
- The clocktick is moved to its own module, it provides a shorthand for the current time and its components like minutes, hours, days etc.
- The old desktop symbols and their container are removed
- Window snapping preview was migrated to the new multi-desktop(-compatible (possibly)) layer architecture
- Panel customisation
    - Position can now be changed
    - A menu for more granular controls was added
    - A makeshift [plasma-esque](https://community.kde.org/Plasma/Plasma_6) edit mode was added
        - You stay in edit mode as long as youre actively changing settings
        - For now, the menu doesnt contain anything and closes by clicking
        - Opening both position and more options keeps edit mode on until you pick a position AND confirm your other settings
        - In edit mode, you can edit any panel and stay in edit mode. settings are not lost (there arent any, coming soon, but if theyre here, they wont be lost)
- Planned:
    - Applets
        - Can be linked, so they are synchronised
    - Importing and exporting panel config, saved either locally or on the server if you wish
    - reset settings, resetting to previously saved state
    - saving occurs if a definite action is being taken
        - a definite action is chosing a position, changing anything thats accessible via the context menu or exiting edit mode for the More options menu
        - it will save the settings as is, overwriting the current config.
    - Options in more options:
        - Panel width and height
            - context menu's fullwidth will override
            - Height/width modes:
                - Fit: Scales according to content, but not wider than the max width, which is defined by the horizontal offset
                - Fixed: Specify a number in px
                - Full: Full width
        - Offset (from edges)
        - Floating
            - Synchronised with context menu's floating option
            - Floating=false overrides the offset from the docked edge (implemented)
        - Locking panel
            - disallowing any changes to a panel until unlocked again (no password required)
        - Border radius
        - Color: Background color of the panel
        - Transparency: How transparent is the panel background, does not affect any applets

0.1.240911_b
- Fixed minor bug

### 0.1.240910_a
- Only committing because im scared of losing progress
- Panels can now be created and styled properly in code, though you still cant add applets

0.1.240910_b
- Panels can now be customised in the following ways:
    - Position: attach to 4 cardinal edges and 4 corners
    - Floating: Defines if panel is flush with screen edges
    - Fullwidth: Defines if panel stretches the entire width/height of screen
    - Full width only works if the panel is docked to a cardinal edge (not in a corner), THIS IS INTENTIONAL!
- All settings are available through the context menu

### 0.1.240909

- Fixed bug where open drop down menus would cause the desktop environment to resize itself

### 0.1.240907
- Windows and desktop symbols are now located inside the new desktop environment
- you can now select multiple desktop symbols by holding the shift key
- opening applications now requires a double click
- theres a new wallpaper called "iceland"
- The new desktop environment layers work via the visibility CSS property, i mention this because i just found out thats a thing.

### 0.1.240906

- Desktop:
    - Desktop symbols now show if they are locked or not
    - Slightly changes the structure of a `desktop-symbol` element
    - System applications now have a small badge marking them as such
    - Prepwork for rewrite of desktop as a whole
        - Desktop class will manage windows, widgets, icons, windows
        - Multiple desktops will be possible
    - new desktop will work with layers, desktop symbols are always on layer 1, windows on layer 3 and panels on layer 5
    - Widgets (will) have their separate layers, 0, 2 or 4, so that its possible to customise their draw order
- Windows:
    - Slightly altered design
    - Window themes are now easier to create, using CSS variables where they make sense
    - These variables are declared in their own separate stylesheet which can in theory be swapped out at runtime
    - slightly restructured the header
- Other:
    - New module that keeps track of special key presses like Shift, Alt etc., exporting booleans describing if they are pressed
    - Slight restructuring, desktop environment related stuff is now in its own location, although not everything has been sorted, desktop symbols are still an UI element
    - The window dragging function was slightly altered to accomodate the change in header structure
    - Right clicking now recursively checks if the parent has a context menu defined, if it doesnt have its own.
        - only checks until it finds a <body> or an element with a data attribute called `stopCtxPropagation` set to `true`
0.1.240906_b
- Fixed context menu propagation



### 0.1.240831
- Prepwork for rework of applications as a whole with a new AppManager module that handles individual granular permissions
- Draft for new Errors
- New base class for desktop widgets
- New Desktop module, will contain desktop related components as a parent module similar to Util module
- Planned: DesktopManager.mjs, will handle positioning of symbols and widgets and by extension panels
- Planned: shortcutmanager.mjs, will handle keyboard shortcuts for apps and system
- added Button component
- various other changes
Overall not really anything productive

### 0.1.240823
- Documentation part 1
- Small changes here and there

#### 0.1.240823_b
- Panel class (rough draft)
- some more docs

### 0.1.240822
- Changes to error box
- No longer called error box, instead its now a class DialogBox
- Locked desktop elements now throw an error message on the screen telling the user why clicking does nothing
- accordingly changed all existing error dialogs

### 0.1.240821
- Context menus now functional
- Desktop symbols now come with their own semi-customisable context menus
    - Some default options are always present, like title, description, open button, lock option
    - Bottom grid still has some placeholders
    - Middle section can be customised to your liking, though right now only through the apps config file, meaning handlers dont yet work since functions cannot be serialised, a solution is coming soon
- Applications (also files, folders, shortcuts, when they arrive) can now have a description (For apps, this is defined in the config.json)
- Locking sorta works, it prevents the app from being opened.
    - The aim is to have locked elements require a password to open or unlock them
    - Password query for locking elements is also a good idea i think
    - The lock state of anything is stored in the user data where it makes sense.
    - For desktop symbols, its in the same object the position, text etc is stored in.
- Minor improvements to Util.create(), empty strings are now filtered out for classList
- Fixed clock desktop widget formatting issue where it shows a large AM or PM below the date, it is removed entirely.
    - This fix potentially only works for the english language.
- Removed a lot of clutter by restructuring, turning desktop symbols into a system of inheriting classes (Only App symbols for now, folders, files and shortcuts are coming At Some Point (TM))
- Desktop symbols can now have a different name to their app
    - The name of the app as defined by the server is still visible in the context menu, but the label can differ now, in preparation for the ability to rename desktop shortcuts

### 0.1.240806
- Settings app:
    - made a few changes to how the settings DOM tree is generated, code is now structured slightly better
    - Settings app is a prime candidate for being put into a webworker, but nothing happened on that front
    - Packages
        - overview of "installed" apps
        - Shows name of app, id, date when it was last "installed", time it was last used, the author and the type (i.e. App, Widget etc)
        - Packages of type "App" can be started from here
        - Selection and sorting works
        - Its all WIP still, data is all made up, in the future this will be requested from the server
        - removing packages will be possible in the future
        - a button to add packages will be added too
        - the end goal is to have it update live
    - User
        - Temporarily put some user settings here as a layout draft
        - will be put in a separate app that prompts the user for the password before granting access
    - Appearance
        - started adding buttons to call the new windows
        - These wont be separate apps
        - changes will be made to how windows are handled to allow apps calling in secondary windows
        - necessary because theres a ton of options planned for each of these
- Login screen
    - idk why it worked before but i fixed it anyways, slight restructure, a nice animation, auto login if a session token is present
    - made a default wallpaper to avoid copyright issues, the mountains however will stay for now, im willing to risk it
- Fixed textbox with filtering dropdown, filter was slightly broken
- ignore "App (new).mjs"

0.1.240806_b
- Profile
    - Changed some styling around so that only one data attribute needs to be updated for the online status display


### 0.1.240819

- Minor commit: prepwork for context menu

0.1.240819_b
- Context menu class
- takes array of objects with specific structure, docs coming soon (promise)
- styling
- an example context menu can be looked at just by right clicking a desktop symbol
- clicking anywhere except the context menu itself closes it
    - elements of the context menu also close it
- eventually the goal is to attach an object to DOM elements.
    - there could be an issue with security, if the handler functions are just exposed, but since apps cant access any dom element outside of their own scope (in theory) that shouldnt be an issue
    - The advantage is that its easier to create and keep track of what element requires what context menu
- so far, buttons can be arranged in lists and grids and there are horizontal divider lines, titles and text.
    - grid layout is 5 icons in however many rows it takes
    - list layout is like the classic context menu
    - dividers divide
    - title is 14pt text, white color, fairly heavy, restricted to one line and gets ellipsis'd
    - text is 12pt, grey, can wrap and isnt limited in size by software, only by practicality.
    - icons are optional for list items
    - The design guideline specifies that grid elements must have an icon. It is designed to fail in a controlled manner, however. It provides a trace, but it triggers failsaves strategically.
    - If a grid element does need to not have an icon for whatever reason, just provide a dummy class. maybe start keymashing, idk, something that doesnt get interpreted into anything. Doing so does not trigger the failsaves.


### 0.1.240731

- No functional changes have been made
- preparation for change to taskbar
    - Taskbar in its current form will be removed in favor of an approach inspired by Cinnamon
    - "Panels" will be introduced, an arbitrary number of panels can be added and populated with customisable functionality
    - styling and behavior will be customisable within reason, some restrictions will apply.
    - Documentation will follow as soon as the planning phase is finished

### 0.1.240729
- Restructured files
- Replaced absolute paths with relative paths where applicable
- minor changes to drag selection on desktop, fixing a bug where the selection is started in color wheels
- changed the current debug behavior for desktop symbols such that it doesnt throw an alert, instead logging the dragged symbol to the console

### 0.1.240721
- new UI elements:
    - Textbox with sliders
    - Textbox with filtering dropdown
    - Dropdown menu
- pre-work for webworkers done
    - all windowed applications, widgets and background tasks will be put into webworkers
    - Main thread will only do UI tasks, worker and server communication
    - webworkers will get non-DOM related util functions attached to the built in objects like `Math`, `String.prototype` etc.
- A slightly non-standard version of markdown:
    - `°text°` marks subscript
    - `^text^` marks superscript
    - `_text_` marks underlined text
    - `~text~` marks strikethrough
    - `*text*` marks italic
    - `**text**` marks bold
    - 4 different header variants, marked by one to four `#` signs followed by a space, corresponding to `<h2>`, `<h3>`, `<h4>`, `<h5>` respectively
    - All markers can be escaped
    - Formatting can overlap, aside from headers.
    - Superscript and subscript can be combined.
    - for visual representations, check the `llama probably` app
- Added a separate "Profile" app, where the profile can be changed. For now it just uses an older version of the settings app as a place holder so it at least has something showing up. It can be accessed
- Added click-and-drag selection (visual only so far, only implemented on desktop)

### 0.1.240625
- Fixed bug where login errors arent displayed
- added api premade complex UI elements:
    - Dropdown menus
    - Color wheels, see below
- added "The hub"
    - accessible with Alt+T
    - will contain currently opened windows grouped and sorted accordingly
    - unread messages (coming soon)
    - weather widget (coming soon)
    - last two are subject to change
- Color wheels:
    - live updates
    - 3 color modes for sliders: RGB, HSV, Hex
    - brightness slider and hue-saturation wheel
    - fires events
    - documentation follows
- bundled [Boxicons v2.1.4](https://boxicons.com/)
    - not fit for deployment in current stage, payload too big to be practical
    - will make switch away from fontawesome
- changes to Util module
    - now split into smaller files
    - upcoming change: where applicable, functions from the util module will be attached to either the corresponding prototype or built in model, for example:
        - Util.math.clamp(min, v, max) will be attached to the built-in Math object
        - Util.math.round(v, d) will be renamed to roundTo(v, d) and attached
        - I am aware this isnt "good practice", but since all third party applets will have to be written relative to and within the bounds of the website, just see it as a superset of js providing additional functionality built in
        - eventually these util functions MIGHT be rewritten in WASM, though whether its worth it or not is debatable

### 0.1.240521
- Maximising windows by double clicking the header
- System applications can now register app event listeners and delete them, although server communication is still not implemented.

### 0.1.240427
- App preparation now done serverside, should protect better against "escaping" applications
- Fixed some issues with app code preparation


### 0.1.240405
- Documentation
- This file
- Added notepad (taken from previous version, not functional, only UI)
- Added terminal (see notepad)
- Bugfixes


### 0.1.240329
- Added Desktop symbols
- Changed some styling
- Added a few skeletons for system apps

### Pre 0.1.240329
Written a somewhat functional skeleton, a few apps, a rudimentary login/signup among a few other things. The exact progress is unknown.
