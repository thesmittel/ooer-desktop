# Whats planned
a list of a few ideas that MAY eventually be implemented

### Login screen changes
A login screen will be made. It will be what first shows up unless there is a valid session token present. 

It will have have text fields for username and password.
Guest login and signup will also be present, both can be individually disabled by the "administrator". 

This will replace the current state of things where users are merely dumped onto an empty desktop having to figure out what to do from there

### Task bar fix
logging out with open windows and logging back in leaves a taskbar icon that cannot be interacted with, fixing this requires a change to how windows work, and will thus be implemented when panels and workers are implemented

### Panels
Will replace the task bar, more customisable, more flexible, similar to what many modern linux desktop environments offer

### Workers
Individual applications will largely switch to webworkers, especially windowed applications. Some system applications will probably continue to run on the main thread, but overall, the main thread will only handle UI updates, with even the server connection being moved to a separate thread. This will improve security and prevent a single application from locking the entire system.
The main thread will spawn a "kernel" thread, which in turn will spawn a connection thread as well as any other threads. Spawned worker threads will only be able to communicate with the "kernel" thread, which keeps track of an applications access level, a users permission etc. 
Webworker instantiation takes time, im hoping it can be done asynchronously.

### Customisation
The plan is to have everything be customisable in a very granular manner. To achieve this, the CSS structure will change drastically. A theme editor will be added and configurations will be exportable. Customisation options will be able to be disabled by the administrator.

### Guest mode
Guest mode users will be assigned temporary usernames, they can be added to circles, although not permanently, and they can send and receive messages as long as a registered user with the appropriate permissions initiates the conversation. only users with the appropriate permission to make files available to guests can do so and only for files that are flagged as guest-viewable. Guest mode is mainly for demonstration purposes.
Changes made to the "user" settings while in guest mode are non-persistent. Collaborative features have to be enabled by a registered user, either with full alteration permissions or "notes only" mode. 
If a guest mode window is closed or the guest logs off, all data that is not part of a collaboration is lost automatically. Messages will only be available to registered users.

### Compartmentalisation
Compartments will be groups of users who are separate from each other. They will only be able to share files etc within their own compartment. Users outside of that compartment will not have access to anything happening inside. 