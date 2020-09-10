### waktu_solat

Demo hosted at: https://waktu-solat.aizu.my/

Objective:
- For production, this website should run on static web hosting, example AWS S3.
- Fast load on small CPU device
	- not require heavy processing on client side
- Can run without dependant on other services/API
- Can run for whole year without breaking (need data for whole year)
- Source, *MUST* coming from JAKIM's e-solat
- Use dayjs instead of momentjs
- use unfetch package (small package compared to axios)

Data folder structure: /data/2020/WLY02/20200905.json
Time zone: /data/zones.json

Data will be prepared in advanced by me on yearly basis.

Steps to run on static hosting / S3:
1. Copy over the files in "out" folder.
2. that's it.

To Do
- [on mobile browser] Do not sleep display on inactive
	- https://github.com/GoogleChrome/samples/tree/gh-pages/battery-status
	- https://github.com/richtr/NoSleep.js


Ref:
- https://www.npmjs.com/package/unfetch
- https://www.npmjs.com/package/dayjs
- https://www.npmjs.com/package/react-use-mutable (There’s nothing wrong with mutating objects - https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/)
- https://github.com/react-ga/react-ga
- https://www.favicon-generator.org/
- https://smartmockups.com/
- https://codepen.io/sdthornton/pen/wBZdXq #Material Design Box Shadows

Question, reach me at aizu.ikmal@gmail.com
