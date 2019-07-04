function tabToggle(val) {
	if (val) {
		document.getElementById("button").style.color = "red";
		document.getElementById("button").innerHTML = "Proxy disabled";
	} else {
		document.getElementById("button").style.color = "green";
		document.getElementById("button").innerHTML = "Proxy enabled";
	}
}

document.addEventListener("click", e => {
	console.log(e);
	if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}

	if (e.target.id.substring(0, 12) === "enableProxy_") {
		let toEnable = e.target.id.substring(12);
		console.log(toEnable);
	}
});

function loadButtons(proxies) {
	html = "";
	console.log(proxies);
	for (let proxy in proxies) {
		let p = proxies[proxy];
		console.log(p);
		html += "<button id=\"enableProxy_" +
			p.name + "\">" +
			p.name + "</button>";
	}
	document.getElementById("proxylist").innerHTML = html;
}

window.onload = function() {
	loadProxiesAndPatterns(loadButtons);
}
