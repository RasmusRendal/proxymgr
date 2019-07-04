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

function loadCallback(loaded, callback) {
	if (Object.keys(loaded).length === 0) {
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
	browser.storage.sync.get("proxies", ret => loadCallback(ret, callback));
}

function loadRules(callback) {
	browser.storage.sync.get("rules", ret => loadRulesCallback(ret, callback))
}

function getBaseUrl(url) {
	// I know this is not i18n complete at all. Sorry non-latin alphabet users
	// And y'all better only be using http or https
	urlregex = /^https?:\/\/([\w\d-\.]*)/;
	let match = url.match(urlregex);
	if (match.length > 1)
		return match[1];
}

function getSubdomains(url) {
	let baseUrl = getBaseUrl(url);
	let ret = []
	let i = 0;
	// DNS supports up to 127 subdomains
	while (baseUrl.indexOf('.') != -1 && i < 128) {
		ret.push('*.' + baseUrl);
		ret.push(baseUrl);
		baseUrl = baseUrl.substring(baseUrl.indexOf('.')+1);
		i++;
	}
	return ret;
}

function generateDropdownFromProxies(proxies) {
	html = "<select id=\"IDTEMPLATE\">"
	html += "<option value=\"null\">Default</option>";
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
	loadProxies(proxies => callback(generateDropdownFromProxies(proxies)));
}

function setRule(rule, value, callback) {
	loadRules(rules => {
		if (value != 'null') {
			rules[rule] = value;
		} else {
			delete rules[rule];
		}
		browser.storage.sync.set({"rules": rules});
		callback(rules);
	})
}
