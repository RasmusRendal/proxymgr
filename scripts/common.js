function loadCallback(loaded, callback) {
	if (Object.keys(loaded).length === 0) {
		callback({'proxies': [{"name": "Default proxy (none)", "proxyObj":
			{
				'type': 'direct',
				'host': '',
				'port': '',
				'username': '',
				'password': '',
				'proxyDNS': true
			}}]});
	} else {
		callback(loaded);
	}
}

function loadProxiesAndPatterns(callback) {
	browser.storage.sync.get("proxies", ret => loadCallback(ret, callback));
}
