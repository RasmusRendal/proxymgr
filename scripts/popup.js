function tabToggle(val) {
	let proxylist = document.getElementById("proxylist");
	for (let i=0; i<proxylist.children; i++) {
		prxylist.children[i].style.color = "black";
	}
	if (val.enabled) {
		document.getElementById("enableProxy_" + val.name).style.color = "green";
	}
}

document.addEventListener("click", e => {
	console.log(e);
	if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}

	if (e.target.id.substring(0, 12) === "enableProxy_") {
		let toEnable = e.target.id.substring(12);
		browser.runtime.sendMessage(toEnable).then(tabToggle);
	}
});

function loadButtons(proxies) {
	html = "";
	for (let proxy in proxies) {
		console.log(proxy);
		let p = proxies[proxy];
		html += "<button id=\"enableProxy_" +
			proxy + "\">" +
			p.name + "</button>";
	}
	document.getElementById("proxylist").innerHTML = html;
}

window.onload = function() {
	loadProxiesAndPatterns(loadButtons);
}
