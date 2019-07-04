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

function loadProxiesAndPatterns(callback) {
	browser.storage.sync.get("proxies", ret => loadCallback(ret, callback));
}

function getBaseUrl(url) {
	// I know this is not i18n complete at all. Sorry non-latin alphabet users
	// And y'all better only be using http or https
	urlregex = /^https?:\/\/([\w\.]*)/;
	return url.match(urlregex)[1];
}
