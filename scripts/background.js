/*
 * Proxymgr
 * Copyright © 2019 Rasmus Rendal <rasmus@rend.al>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var overwritten_tabs = {};

var proxies = {};

var rules = {
	"cloud.rend.al": 1,
	"rend.al": 1
};

var colors = [
	"#0048BA",
	"#B0BF1A",
	"#D3212D",
	"#A4C639",
	"#2E5894"
]

var latestProxy = "";

function reloadSettings() {
	loadProxiesAndPatterns(loadedProxies => {
		proxies = loadedProxies;
	});
}
reloadSettings();

function loadProxy(id) {
	name = proxies[id].name;
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(tabarray => {
		let tab = tabarray[0];
		browser.browserAction.setBadgeText({text: name, tabId: tab.id});
		browser.browserAction.setBadgeBackgroundColor({color: colors[id], tabId: tab.id});
	});
}


browser.proxy.onRequest.addListener(
	function(details) {
		if (details.tabId in overwritten_tabs) {
			let toReturn = proxies[overwritten_tabs[details.tabId]];
			loadProxy(overwritten_tabs[details.tabId]);
			return toReturn;
		}

		let baseUrl = getBaseUrl(details.url);
		if (baseUrl in rules) {
			let toReturn = proxies[rules[baseUrl]];
			loadProxy(rules[baseUrl]);
			return toReturn;
		}

		loadProxy(0);

		return proxies;
	},
	{
		'urls': ['<all_urls>']
	}
);

function tabClicked(tabInfo, toSet, sendResponse) {
	let tabID = tabInfo.id;
	overwritten_tabs[tabID] = toSet;
	getTabStatus(sendResponse);
}

function getTabStatus(callback) {
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(tabarray => {
		let tab = tabarray[0];
		callback({
			'overwritten_status': overwritten_tabs[tab.id],
			'url': getBaseUrl(tab.url),
			'latestProxy': latestProxy
		});
	});
}

function handleMessage(request, sender, sendResponse) {
	if (request.instruction == "enable") {
		browser.tabs.query({
			currentWindow: true,
			active: true
		})
			.then(tabarray => tabClicked(tabarray[0], request.toEnable, sendResponse));
		return true;
	} else if (request.instruction == "getinfo") {
		getTabStatus(sendResponse);
		return true;
	}
}

browser.runtime.onMessage.addListener(handleMessage);

browser.storage.onChanged.addListener((changes, areaName) => {
	reloadSettings();
})
