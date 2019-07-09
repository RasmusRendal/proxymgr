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

function loadProxiesCallback(loaded, callback) {
	if (typeof(loaded) === 'undefined' || Object.keys(loaded).length < 1) {
		callback(defaultProxy());
	} else {
		callback(loaded.proxies);
	}
}

function loadRulesCallback(loaded, callback) {
	if (Object.keys(loaded).length === 0) {
		callback({});
	} else {
		callback(loaded.rules);
	}
}

function loadProxies(callback) {
	browser.storage.sync.get("proxies", ret => loadProxiesCallback(ret, callback));
}

function loadRules(callback) {
	browser.storage.sync.get("rules", ret => loadRulesCallback(ret, callback))
}

function getBaseUrl(url) {
	urlregex = /^https?:\/\/([\w\d-\.]*)/;
	let match = url.match(urlregex);
	if (match != null && match.length >= 2)
		return match[1];
}

function getSubdomains(url) {
	let baseUrl = getBaseUrl(url);
	if (typeof(baseUrl) === 'undefined')
		return [];
	let subdomains = []
	let i = 0;
	// DNS supports up to 127 subdomains
	while (baseUrl.indexOf('.') != -1 && i < 128) {
		subdomains.push('*.' + baseUrl);
		subdomains.push(baseUrl);
		baseUrl = baseUrl.substring(baseUrl.indexOf('.')+1);
		i++;
	}
	return subdomains;
}

function GeterateProxyDropdownFromProxies(proxies) {
	html = "<select id=\"IDTEMPLATE\" class=\"browser-style\">"
	for (let proxy in proxies) {
		let p = proxies[proxy];
		html += "<option value=\"" +
			proxy + "\">" +
			p.name + "</option>";
	}
	html += "</select>"
	return html;
}

function generateProxyDropdown(callback) {
	loadProxies(proxies => callback(GeterateProxyDropdownFromProxies(proxies)));
}

function setRule(rule, value, callback) {
	loadRules(rules => {
		if (value != 0) {
			rules[rule] = value;
		} else {
			delete rules[rule];
		}
		browser.storage.sync.set({"rules": rules});
		callback(rules);
	})
}
