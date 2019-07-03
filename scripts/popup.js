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
	if (e.target.id == "button") {
		browser.runtime.sendMessage(
			true
		).then(tabToggle);
	} else if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}
});

browser.runtime.sendMessage(false).then(tabToggle);
