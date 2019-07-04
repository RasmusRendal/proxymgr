function defaultProxy() {
	return [
		{
			'type': 'direct',
			'name': 'Direct Internet',
			'host': '',
			'port': '',
			'username': '',
			'password': '',
			'proxyDNS': true
		}
		];
}

function loadCallback(loaded, callback) {
	if (Object.keys(loaded).length === 0) {
		callback(defaultProxy());
	} else {
		callback(loaded.proxies);
	}
}

function loadProxiesAndPatterns(callback) {
	browser.storage.sync.get("proxies", ret => loadCallback(ret, callback));
}

function getBaseUrl(url) {
	// I know this is not i18n complete at all. Sorry non-latin alphabet users
	// And y'all better only be using http or https
	urlregex = /^https?:\/\/([\w\.]*)/;
	return url.match(urlregex)[1];
}
