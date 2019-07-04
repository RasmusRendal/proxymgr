var overwritten_tabs = {};

var proxies = {};

var rules = {
	"rend.al": "Direct Internet"
};

loadProxiesAndPatterns(loadedProxies => {
	proxies = loadedProxies;
});

browser.proxy.onRequest.addListener(
	function(details) {
		if (details.tabId in overwritten_tabs) {
			console.log("nice");
			console.log(overwritten_tabs);
			console.log(proxies[overwritten_tabs[details.tabId]]);
			return proxies[overwritten_tabs[details.tabId]];
		}

		return proxies;
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
