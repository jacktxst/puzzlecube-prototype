# What is this?

This is a prototype for a game I'm working on. The only reason this repo is public is because I'm hosting the game on a github pages site here for playtesting. Nothing to see here, move along!

# TODO:

- [ ] display currently selected block type in editor
- [ ] all buttons must be pressed to open the door (AND)
- [ ] wires and logic gates?
- [x] editor block pallette
- [ ] editor: implement click+drag for cuboid fill, with preview hologram
- [ ] editor bug: hologram still stays even when you move mouse off of the grid
- [x] fix parralel universe bug by enforcing strict bounds
- [x] levels should be "compressed" to not include all the empty stuff
- [x] level export and level editor controls should be well documented
- [ ] support for texturing the blocks
- [ ] add "new level"
- [ ] bugfix: moving block destroying stuff
- [ ] hide mobile controls on pc
- [ ] unify audio and gameaudio.
- [x] animate moving cube
- [ ] animate lift
- [x] animate falling tile
- [ ] animate level win

# CONTROLS

W, A, S, and D to move.

# LEVEL EDITOR FUNCTIONALITY:

| key | action |
| --- | --- |
| v | toggle editor visibility |
| e | toggle erase mode |
| +/- | change selected block type |
| 0-9 | change selected block type |
| r | restart level/restore initial state |
| c | copy the current level string to the clipboard |
| q | quicksave level changes so that pressing 'r' resets to this state |