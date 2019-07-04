function defaultProxy() {
	return {"name": "Default proxy (none)", "proxyObj":
		{
			'type': 'direct',
			'host': '',
			'port': '',
			'username': '',
			'password': '',
			'proxyDNS': true
		}};
}

function loadCallback(loaded, callback) {
	if (Object.keys(loaded).length === 0) {
		callback([defaultProxy()]);
	} else {
		callback(loaded.proxies);
	}
}

function loadProxiesAndPatterns(callback) {
	browser.storage.sync.get("proxies", ret => loadCallback(ret, callback));
}
