var overwritten_tabs = {};

var proxies = [];

loadProxiesAndPatterns(loadedProxies => {
	proxies = loadedProxies;
});

browser.proxy.onRequest.addListener(
	function(details) {
		retVal = []
		for (let proxy in proxies) {
			let p = proxies[proxy];
			retVal.push(p.proxyObj);
		}
		return retVal;
	},
	{
		'urls': ['<all_urls>']
	}
);

function tabClicked(tabInfo, sendResponse) {
	let tabID = tabInfo.id;
	if (disabled_tabs.indexOf(tabID) == -1) {
		disabled_tabs.push(tabID);
		sendResponse(true);
	} else {
		disabled_tabs.splice(disabled_tabs.indexOf(tabID), 1);
		sendResponse(false);
	}
}

function getTabStatus(callback) {
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(tabarray => {
		callback(overwritten_tabs[tabarray[0].id]);
	});
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function handleMessage(request, sender, sendResponse) {

	if (request) {

		browser.tabs.query({
			currentWindow: true,
			active: true
		})
			.then(tabarray => tabClicked(tabarray[0], sendResponse););
	} else {
		getTabStatus(sendResponse);
	}
	return true;

}

browser.runtime.onMessage.addListener(handleMessage);
