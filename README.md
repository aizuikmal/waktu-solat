waktu_solat

Objective:
- For production, this website should run on static web hosting, example AWS S3.
- Fast load on small CPU device
	- not require heavy processing on client side
	- first frame weight, lower then 500kb (should aim lower, probably PWA ?)
- Can run without dependant on other services/API
- Can run for whole year without breaking (need data for whole year)
- Source, *MUST* coming from JAKIM's e-solat
- No momentjs package on production. Size too big. Have to endure JS date parsing. (except on preparing data)

Data folder structure:
/data/2020/WLY02/20200905.json

Data will be prepared in advanced by developer.
