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
	browser.runtime.sendMessage(
		true
	).then(tabToggle);
});

browser.runtime.sendMessage(false).then(tabToggle);
