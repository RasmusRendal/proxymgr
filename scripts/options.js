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

function addProxy(id, proxy) {
	html = "<form class=\"proxiesform\" id=\"" + id + "\">";
	html += "<label for=\"name\">Name:</label>" + "<input type=\"text\" name=\"name\" value=\"" + proxy.name + "\"></input>";
	html += "<label for=\"type\">Proxy Type:</label>" + "<select name=\"type\" selected=\"" + proxy.type + "\">" +
		"<option value=\"direct\"" + ((proxy.type == "direct") ? " selected" : "") + ">Direct</option>" +
		"<option value=\"http\"" + ((proxy.type == "http") ? " selected" : "") + ">HTTP</option>" +
		"<option value=\"https\"" + ((proxy.type == "https") ? " selected" : "") + ">HTTPS</option>" +
		"<option value=\"socks\"" + ((proxy.type == "socks") ? " selected" : "") + ">SOCKS v5</option>" +
		"<option value=\"socks4\"" + ((proxy.type == "socks4") ? " selected" : "") + ">SOCKS v4</option>" +
		"</select>";
	html += "<label for=\"host\">Host:</label>" + "<input type=\"text\" name=\"host\" value=\"" + proxy.host + "\"></input>";
	html += "<label for=\"port\">Port:</label>" + "<input type=\"number\" name=\"port\" value=\"" + proxy.port + "\"></input>";
	html += "<label for=\"username\">Username:</label>" + "<input type=\"text\" name=\"username\" value=\"" + proxy.username + "\"></input>";
	html += "<label for=\"password\">Password:</label>" + "<input type=\"password\" name=\"password\" value=\"" + proxy.password + "\"></input>";
	html += "<label for=\"proxyDNS\">Proxy DNS:</label><select name=\"proxyDNS\" value=\"" + proxy.proxyDNS + "\"><option value=\"true\">True</option><option value\"false\">False</option></select>";
	html += "<button id=\"delete\" value=\"" + name + "\">Delete Proxy</button>";
	html += "</form>";
	document.getElementById("proxiesList").innerHTML += html;
}

function proxiesLoaded(v) {
	document.getElementById("proxiesList").innerHTML = "";
	for (let i=0; i<v.length; i++) {
		addProxy(i, v[i]);
	}
}

function addDefaultProxy() {
	addProxy("0", defaultProxy()[0]);
}

function displayPatterns() {
	document.getElementById("patternsdiv").style.display = "inherit";
	document.getElementById("proxiesdiv").style.display = "none";
}

function displayProxies() {
	document.getElementById("patternsdiv").style.display = "none";
	document.getElementById("proxiesdiv").style.display = "inherit";
	loadProxies(proxiesLoaded);
}

function applyProxySettings() {
	proxiesDiv = document.getElementById("proxiesList");
	proxies = [];
	for (let i=0; i < proxiesDiv.children.length; i++) {
		child = proxiesDiv.children[i];
		proxy = {
			'name': child[0].value,
			'type': child[1].value,
			'host': child[2].value,
			'port': child[3].value,
			'username': child[4].value,
			'password': child[5].value,
			'proxyDNS': (child[6].value == 'true')
		}
		proxies.push(proxy);
	}
	browser.storage.sync.set({"proxies": proxies});
}

function applySettings() {
	applyProxySettings();
}

document.addEventListener("click", e => {
	switch (e.target.id) {
		case "patterns":
			displayPatterns();
			break;
		case "proxies":
			displayProxies();
			break;
		case "applySettings":
			applySettings();
			break;
		case "addProxy":
			addDefaultProxy();
			break;
	}

	if (e.target.id.substr(0, 6) == "delete") {
		console.log(e.target.value);
	}
});

window.onload = function() {
	displayProxies();
}
