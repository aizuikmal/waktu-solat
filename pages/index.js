import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dayjs from 'dayjs'
import 'dayjs/locale/ms-my'
import fetch from 'unfetch'
import SetInterval from 'set-interval'
import zones from '../public/data/zones.json'
import Cookies from 'universal-cookie'
import ReactGA from 'react-ga'
import { BiBrush } from 'react-icons/bi'

ReactGA.initialize('UA-139518627-2')
ReactGA.pageview('/')

const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const cookies = new Cookies()

const waktuTranslate = {
	imsak: 'imsak',
	fajr: 'subuh',
	syuruk: 'syuruk',
	dhuhr: 'zohor',
	asr: 'asar',
	maghrib: 'maghrib',
	isha: 'isyak',
}

export default function Home() {

	const [zone, SET_zone] = useState('WLY01')
	const [waktuSolatAll, SET_waktuSolatAll] = useState(false)
	const [nextSolatName, SET_nextSolatName] = useState(false)
	const [nextSolatTime, SET_nextSolatTime] = useState(false)
	const [nextCountdown, SET_nextCountdown] = useState(false)

	const [styleFile, SET_styleFile] = useState('default')
	const [changeZonePopup, SET_changeZonePopup] = useState(false)
	const [changeStylePopup, SET_changeStylePopup] = useState(false)

	const change_zone = (zone_code) => {
		console.log('zone_code',zone_code)
		SET_zone(zone_code)
		fetch_ws(zone_code)
		SET_changeZonePopup(false)
		cookies.set('_waktusolat_aizu_my_zone', zone_code, { path: '/' })
	}

	const change_style = (style_code) => {
		console.log('style_code',style_code)
		SET_styleFile(style_code)
		SET_changeStylePopup(false)
		cookies.set('_waktusolat_aizu_my_style', style_code, { path: '/' })
	}

	const fetch_ws = async (zone_code) => {
		const loc = `data/timetable/${dayjs().format('YYYY')}/${zone_code}/${dayjs().format('YYYY-MM-DD')}.json`
		const resp = await fetch(loc)
		const ws_raw = await resp.json()
		SET_waktuSolatAll(ws_raw)
		console.log(loc,ws_raw)
	}

	const calc_next_waktu_solat = () => {

		const current_time = dayjs().format('X')
			
		let item
		for(item in waktuSolatAll){
			const time_x = dayjs(`${dayjs().format('DD MMM YYYY')} ${waktuSolatAll[item]}`).format('X')
			if(current_time <= time_x){
				// console.log(item,`${time_x} - ${dayjs.unix(time_x).format('HH:mm:ss')}`)
				SET_nextSolatName(item)
				SET_nextSolatTime(time_x)
				let balanced_time = (parseInt(time_x - current_time)) - 27000
				console.log(`${zone}, ${time_x}`, balanced_time )
				SET_nextCountdown(dayjs.unix(balanced_time).format('HH:mm:ss').split(':'))
				break
			}
		}

	}

	useEffect(() => {

		const cookie_style = cookies.get('_waktusolat_aizu_my_style', { path: '/' })
		console.log('cookie_style',cookie_style)
		if(cookie_style){ SET_styleFile(cookie_style) }

		const cookie_zone = cookies.get('_waktusolat_aizu_my_zone', { path: '/' }) ?? 'WLY01'
		SET_zone(cookie_zone)
		fetch_ws(cookie_zone)
	},[])

	useEffect(() => {	
		if(waktuSolatAll){
			calc_next_waktu_solat()
			SetInterval.clear('test')
			SetInterval.start(calc_next_waktu_solat, 1000, 'test')
		}
	},[waktuSolatAll])

	return (
		<div className="container">
			<Head>
				<title>Waktu Solat</title>
				<link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
				<link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
				<link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
				<link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
				<link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
				<link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
				<link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="manifest" href="/favicon/manifest.json" />
				<meta name="msapplication-TileColor" content="#ffffff" />
				<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
				<meta name="theme-color" content="#ffffff" />
				<link rel="stylesheet" href={`styles/${styleFile}.css`} />
			</Head>

			<div className="wrapper">
				<div className="bg-image"></div>
				<h1>Waktu Solat</h1>

				{
					changeZonePopup &&
					<div className="change_popup">
						<h1>Tukar Zon</h1>
						<select defaultValue={zone} onChange={e => change_zone(e.target.value)}>
							<optgroup label="Johor"><option value="JHR01" className="hs">JHR01 - Pulau Aur dan Pulau Pemanggil </option><option value="JHR02" className="hs">JHR02 - Johor Bahru, Kota Tinggi, Mersing</option><option value="JHR03" className="hs">JHR03 - Kluang, Pontian</option><option value="JHR04" className="hs">JHR04 - Batu Pahat, Muar, Segamat, Gemas Johor</option></optgroup><optgroup label="Kedah"><option value="KDH01" className="hs">KDH01 - Kota Setar, Kubang Pasu, Pokok Sena (Daerah Kecil)</option><option value="KDH02" className="hs">KDH02 - Kuala Muda, Yan, Pendang</option><option value="KDH03" className="hs">KDH03 - Padang Terap, Sik</option><option value="KDH04" className="hs">KDH04 - Baling</option><option value="KDH05" className="hs">KDH05 - Bandar Baharu, Kulim</option><option value="KDH06" className="hs">KDH06 - Langkawi</option><option value="KDH07" className="hs">KDH07 - Puncak Gunung Jerai</option></optgroup><optgroup label="Kelantan"><option value="KTN01" className="hs">KTN01 - Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku</option><option value="KTN03" className="hs">KTN03 - Gua Musang (Daerah Galas Dan Bertam), Jeli</option></optgroup><optgroup label="Melaka"><option value="MLK01" className="hs">MLK01 - SELURUH NEGERI MELAKA</option></optgroup><optgroup label="Negeri Sembilan"><option value="NGS01" className="hs">NGS01 - Tampin, Jempol</option><option value="NGS02" className="hs">NGS02 - Jelebu, Kuala Pilah, Port Dickson, Rembau, Seremban</option></optgroup><optgroup label="Pahang"><option value="PHG01" className="hs">PHG01 - Pulau Tioman</option><option value="PHG02" className="hs">PHG02 - Kuantan, Pekan, Rompin, Muadzam Shah</option><option value="PHG03" className="hs">PHG03 - Jerantut, Temerloh, Maran, Bera, Chenor, Jengka</option><option value="PHG04" className="hs">PHG04 - Bentong, Lipis, Raub</option><option value="PHG05" className="hs">PHG05 - Genting Sempah, Janda Baik, Bukit Tinggi</option><option value="PHG06" className="hs">PHG06 - Cameron Highlands, Genting Higlands, Bukit Fraser</option></optgroup><optgroup label="Perlis"><option value="PLS01" className="hs">PLS01 - Kangar, Padang Besar, Arau</option></optgroup><optgroup label="Pulau Pinang"><option value="PNG01" className="hs">PNG01 - Seluruh Negeri Pulau Pinang</option></optgroup><optgroup label="Perak"><option value="PRK01" className="hs">PRK01 - Tapah, Slim River, Tanjung Malim</option><option value="PRK02" className="hs">PRK02 - Kuala Kangsar, Sg. Siput (Daerah Kecil), Ipoh, Batu Gajah, Kampar</option><option value="PRK03" className="hs">PRK03 - Lenggong, Pengkalan Hulu, Grik</option><option value="PRK04" className="hs">PRK04 - Temengor, Belum</option><option value="PRK05" className="hs">PRK05 - Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor</option><option value="PRK06" className="hs">PRK06 - Selama, Taiping, Bagan Serai, Parit Buntar</option><option value="PRK07" className="hs">PRK07 - Bukit Larut</option></optgroup><optgroup label="Sabah"><option value="SBH01" className="hs">SBH01 - Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Tambisan, Bandar Sandakan, Sukau</option><option value="SBH02" className="hs">SBH02 - Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)</option><option value="SBH03" className="hs">SBH03 - Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku, Bahagian Tawau  (Timur)</option><option value="SBH04" className="hs">SBH04 - Bandar Tawau, Balong, Merotai, Kalabakan, Bahagian Tawau (Barat)</option><option value="SBH05" className="hs">SBH05 - Kudat, Kota Marudu, Pitas, Pulau Banggi, Bahagian Kudat</option><option value="SBH06" className="hs">SBH06 - Gunung Kinabalu</option><option value="SBH07" className="hs">SBH07 - Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan, Bahagian Pantai Barat</option><option value="SBH08" className="hs">SBH08 - Pensiangan, Keningau, Tambunan, Nabawan, Bahagian Pendalaman (Atas)</option><option value="SBH09" className="hs">SBH09 - Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pa Sia, Membakut, Weston, Bahagian Pendalaman (Bawah)</option></optgroup><optgroup label="Selangor"><option value="SGR01" className="hs">SGR01 - Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam</option><option value="SGR02" className="hs">SGR02 - Kuala Selangor, Sabak Bernam</option><option value="SGR03" className="hs">SGR03 - Klang, Kuala Langat</option></optgroup><optgroup label="Sarawak"><option value="SWK01" className="hs">SWK01 - Limbang, Lawas, Sundar, Trusan</option><option value="SWK02" className="hs">SWK02 - Miri, Niah, Bekenu, Sibuti, Marudi</option><option value="SWK03" className="hs">SWK03 - Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu</option><option value="SWK04" className="hs">SWK04 - Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit</option><option value="SWK05" className="hs">SWK05 - Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai</option><option value="SWK06" className="hs">SWK06 - Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok</option><option value="SWK07" className="hs">SWK07 - Serian, Simunjan, Samarahan, Sebuyau, Meludam</option><option value="SWK08" className="hs">SWK08 - Kuching, Bau, Lundu, Sematan</option><option value="SWK09" className="hs">SWK09 - Zon Khas (Kampung Patarikan)</option></optgroup><optgroup label="Terengganu"><option value="TRG01" className="hs">TRG01 - Kuala Terengganu, Marang, Kuala Nerus</option><option value="TRG02" className="hs">TRG02 - Besut, Setiu</option><option value="TRG03" className="hs">TRG03 - Hulu Terengganu</option><option value="TRG04" className="hs">TRG04 - Dungun, Kemaman</option></optgroup><optgroup label="Wilayah Persekutuan"><option value="WLY01" className="hs">WLY01 - Kuala Lumpur, Putrajaya</option><option value="WLY02" className="hs">WLY02 - Labuan</option></optgroup>
						</select>
						<a onClick={() => SET_changeZonePopup(false)}>Kembali</a>
					</div>
				}

				{
					changeStylePopup &&
					<div className="change_popup">
						<h1>Tukar Gaya Paparan</h1>
						<select defaultValue={styleFile} onChange={e => change_style(e.target.value)}>
							<option value="default" className="hs">Gaya asal</option>
							<option value="dark-simple" className="hs">Gelap & Minimalis</option>
						</select>
						<a onClick={() => SET_changeStylePopup(false)}>Kembali</a>
					</div>
				}

				{
					!changeZonePopup && !changeStylePopup &&
					<>
					<div className="main">
						
						<div className="change-theme" onClick={() => SET_changeStylePopup(true) }><BiBrush /></div>

						<div className="waktu">
							<p>Waktu seterusnya</p>
							<h1>{ waktuTranslate[nextSolatName] }</h1>
							<h2>{ zones[zone] }</h2>
							<a onClick={() => SET_changeZonePopup(true) }>Tukar Lokasi</a>
						</div>
						<div className="datetime">
							<p>pada jam</p>
							<h1>{ dayjs.unix(nextSolatTime).format('h:mm a')}</h1>
							<h2>{dayjs().locale('ms-my').format('dddd, D MMMM YYYY')}</h2>
						</div>
						<div className="countdown">
							<p>dalam masa</p>
							<h1>
							{ nextCountdown && nextCountdown[0] != '00' && <div className="h"><span>{ nextCountdown[0].substring(0,1) == '0' ? nextCountdown[0].substring(1) : nextCountdown[0]}</span> <label>jam</label></div> }
							{ nextCountdown && nextCountdown[1] != '00' && <div className="m"><span>{ nextCountdown[1].substring(0,1) == '0' ? nextCountdown[1].substring(1) : nextCountdown[1] }</span> <label>minit</label></div> }
							{ <div className="s"><span>{ nextCountdown && nextCountdown[2].substring(0,1) == '0' ? nextCountdown[2].substring(1) : nextCountdown[2] }</span> <label>saat</label></div> }
							</h1>
						</div>
					</div>

					<div className="credit">
						<div className="esolat">
							<h1>Waktu solat dari laman rasmi</h1>
							<h2 onClick={() => window.location='https://www.e-solat.gov.my' }>www.e-solat.gov.my</h2>
						</div>
					</div>

					{/* <div className="change-theme">Tukar Gaya Persembahan</div> */}

					<div className="timetable">
						<h1>Waktu Solat</h1>
						<h2>{dayjs().locale('ms-my').format('D MMM YYYY')}</h2>
						<div className="listing">
							<div className="item"><label>Imsak</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.imsak}`).format('h:mm a') }</span></div>
							<div className="item"><label>Subuh</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.fajr}`).format('h:mm a') }</span></div>
							<div className="item"><label>Syuruk</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.syuruk}`).format('h:mm a') }</span></div>
							<div className="item"><label>Zohor</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.dhuhr}`).format('h:mm a') }</span></div>
							<div className="item"><label>Asar</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.asr}`).format('h:mm a') }</span></div>
							<div className="item"><label>Maghrib</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.maghrib}`).format('h:mm a') }</span></div>
							<div className="item"><label>Isyak</label><span>{ dayjs(`1 Jan 2000 ${waktuSolatAll.isha}`).format('h:mm a') }</span></div>
						</div>
					</div>
					<div className="footer">
						Sumber laman ini boleh didapati dari <a href="https://github.com/aizuikmal/waktu-solat">sini</a>.<br />Hakcipta data dari laman rasmi www.esolat.gov.my.<br />
						Pihak kami berusaha untuk memastikan data yang dipaparkan adalah sama seperti laman rasmi E-solat, walaubagaimanapun, ralat data adalah diluar kemampuan jangkaan kami.
					</div>
					</>
				}

			</div>

		</div>
	)
}
