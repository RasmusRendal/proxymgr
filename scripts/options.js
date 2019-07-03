function proxiesLoaded(v) {
	let html = ""
	for (let p in v.proxies) {
		let name = v.proxies[p].name;
		let proxy = v.proxies[p].proxyObj;
		html += "<form class=\"proxiesform\">";
		html += "<label for=\"name\">Name:</label>" + "<input type=\"text\" name=\"name\" value=\"" + name + "\"></input>";
		html += "<label for=\"type\">Proxy Type:</label>" + "<select name=\"type\" value=\"" + proxy.type + "\">" +
			"<option value=\"direct\">Direct</option>" +
			"<option value=\"http\">HTTP</option>" +
			"<option value=\"https\">HTTPS</option>" +
			"<option value=\"socks\">SOCKS v5</option>" +
			"<option value=\"socks4\">SOCKS v4</option>" +
			"</select>";
		html += "<label for=\"host\">Host:</label>" + "<input type=\"text\" name=\"host\" value=\"" + proxy.host + "\"></input>";
		html += "<label for=\"port\">Port:</label>" + "<input type=\"number\" name=\"port\" value=\"" + proxy.port + "\"></input>";
		html += "<label for=\"username\">Username:</label>" + "<input type=\"text\" name=\"username\" value=\"" + proxy.username + "\"></input>";
		html += "<label for=\"password\">Password:</label>" + "<input type=\"password\" name=\"password\" value=\"" + proxy.password + "\"></input>";
		html += "<label for=\"proxyDNS\">Proxy DNS:</label><select name=\"proxyDNS\" value=\"" + proxy.proxyDNS + "\"><option value=\"true\">True</option><option value\"false\">False</option></select>";
		html += "</form>";
	}
	document.getElementById("proxiesdiv").innerHTML = html;
}

function loadPatterns() {
	document.getElementById("patternsdiv").style.display = "inherit";
	document.getElementById("proxiesdiv").style.display = "none";
}

function loadProxies() {
	document.getElementById("patternsdiv").style.display = "none";
	document.getElementById("proxiesdiv").style.display = "inherit";
	loadProxiesAndPatterns(proxiesLoaded);
}

function applyProxySettings() {
	proxiesDiv = document.getElementById("proxiesdiv");
	proxies = [];
	for (let i=0; i < proxiesDiv.children.length; i++) {
		child = proxiesDiv.children[i];
		console.log(child);
		proxy = {
			'name': child[0].value,
			'proxyObj': {
				'type': child[1].value,
				'host': child[2].value,
				'port': child[3].value,
				'username': child[4].value,
				'password': child[5].value,
				'proxyDNS': (child[6].value == 'true')
			}
		}
		console.log(proxy);
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
			loadPatterns();
			break;
		case "proxies":
			loadProxies();
			break;
		case "applySettings":
			applySettings();
			break;
	}
});

window.onload = function() {
	loadProxies();
}
