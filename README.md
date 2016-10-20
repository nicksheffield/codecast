# Codecast

*Broadcast your coding project live across your local network.*

I created this as a teaching tool, so that my students could easily explore my code at their own pace during live coding demonstrations. It also allows them to broadcast their own code to each other, so they could help each other out. 

Started as a command line tool called [Live File View](https://github.com/nicksheffield/live-file-view), before I discovered [electron](http://electron.atom.io/) and [evilscan](https://github.com/eviltik/evilscan) and realised I could make it into a desktop app experience.

So far there is only a MacOS build, and it is not signed, which means you will need to allow apps from untrusted developers.

---

### Development

To build it yourself, run:

```
git clone https://github.com/nicksheffield/codecast.git
npm install
npm run dist
```

The code is a relative mess, but it was a learning experience in both getting to grips with some ES6 features, and also using angularjs with electron.