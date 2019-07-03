disabled_tabs = [];

browser.proxy.onRequest.addListener(
	function(details) {
		if (details.url.includes('local'))
			return null;
		if (details.url.substr(0, 7) == "192.168")
			return null;
		if (disabled_tabs.indexOf(details.tabId) != -1)
			return null;
		return {
			'type': 'socks',
			'host': 'localhost',
			'port': '9050'
		};
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
		callback(disabled_tabs.indexOf(tabarray[0].id) != -1);
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
		}
	).then(tabarray => { tabClicked(tabarray[0], sendResponse); });
	} else {
		getTabStatus(sendResponse);
	}
	return true;

}

browser.runtime.onMessage.addListener(handleMessage);
