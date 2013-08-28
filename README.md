js-rdt
======

**JavaScript Remote Debugging ToolKit** is working concept of client-server application that
helps JavaScript developer debug/develop application.

**Target platforms:**
 Any devices with lack of abilities listed below.
 (I use js-rdt for debugging HTML5 games on SmartTV devices)

**Plan:**
 1) remote console.log (remoteUtils.send.log) - **implemented**
 2) remote profiler (see my js-profiler as concept of client profiler)
 3) remote screen-shot maker

version
=======
1.1 (folder /build/1.1/windows/)

usage example
=============

**start server application, setup IP address/port and start server:**
/build/1.1/windows/js-rdt.exe
OR
/tools/node-webkit/node-webkit-v0.7.1-win-ia32/nw.exe src

**run included test web application**
type in browser "ip:port/" where ip and port - values that were set on previous step

**take a look on LOGGER page of server**

license
=======
MIT License

third party licenses
====================
node-webkit: MIT License (/tools/node-webkit/LICENSE)

Possibly, will be used in the future:
TraceKit: MIT
StackTraceJS: Public Domain
html2canvas: MIT