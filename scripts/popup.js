function infoReceived(info) {
	document.getElementById("url").innerHTML = info.url;

	let proxylist = document.getElementById("proxylist");
	for (let i=0; i<proxylist.children.length; i++) {
		proxylist.children[i].style.color = "black";
	}
	if (typeof(info.overwritten_status) != 'undefined') {
		document.getElementById("enableProxy_" + info.overwritten_status).style.color = "green";
	}
}

document.addEventListener("click", e => {
	if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}

	if (e.target.id.substring(0, 12) === "enableProxy_") {
		let toEnable = e.target.id.substring(12);
		browser.runtime.sendMessage({"instruction": "enable", "toEnable": toEnable}).then(infoReceived);
	}
});

function loadButtons(proxies) {
	html = "";
	for (let proxy in proxies) {
		let p = proxies[proxy];
		html += "<button id=\"enableProxy_" +
			proxy + "\">" +
			p.name + "</button>";
	}
	document.getElementById("proxylist").innerHTML = html;
}

window.onload = function() {
	loadProxiesAndPatterns(loadButtons);
	browser.runtime.sendMessage({"instruction": "getinfo"}).then(infoReceived);
}
