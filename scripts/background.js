var overwritten_tabs = {};

var proxies = {};

loadProxiesAndPatterns(loadedProxies => {
	proxies = loadedProxies;
});

browser.proxy.onRequest.addListener(
	function(details) {
		if (details.tabId in overwritten_tabs) {
			console.log("nice");
			return proxies[overwritten_tabs[details.tabId]];
		}

		retVal = []
		for (let proxy in proxies) {
			retVal.push(proxies[proxy]);
		}
		return retVal;
	},
	{
		'urls': ['<all_urls>']
	}
);

function tabClicked(tabInfo, toSet, sendResponse) {
	let tabID = tabInfo.id;
	overwritten_tabs[tabID] = toSet;
	sendResponse({
		'name': toSet,
		'enabled': true
	});
}

function getTabStatus(callback) {
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(tabarray => {
		callback(overwritten_tabs[tabarray[0].id]);
	});
}

function handleMessage(request, sender, sendResponse) {
	browser.tabs.query({
		currentWindow: true,
		active: true
	})
	.then(tabarray => tabClicked(tabarray[0], request, sendResponse));

	return true;
}

browser.runtime.onMessage.addListener(handleMessage);
