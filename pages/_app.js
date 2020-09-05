import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router'
import PropTypes from 'prop-types';
import Head from 'next/head';

import '../styles.css'

import axios from 'axios'
import Cookies from 'universal-cookie';
const cookies = new Cookies()

axios.defaults.withCredentials = true

export default function MyApp(props) {
	
	const router = useRouter()
	const { Component, pageProps } = props;

	const init = () => {
		
	}

	useEffect(() => {

		init()

	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>Waktu Solat by Aizu</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="shortcut icon" href="/favicon.png" />
			</Head>
			<Component {...pageProps} />
		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
