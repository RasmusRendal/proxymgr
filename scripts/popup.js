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

var proxySwitcherHTML = "";
var tabStatus = {};
var rules = {};

function displayRules() {
	if (typeof(tabStatus.overwritten_status) != 'undefined') {
		document.getElementById("perTab").value = tabStatus.overwritten_status;
	} else {
		document.getElementById("perTab").value = "0";
	}

	for (rule in rules) {
		let index = tabStatus.subdomains.indexOf(rule);
		if (index != -1) {
			document.getElementById("select_perm_" + index).value = rules[rule];
		}
	}
}

function updateDisplay() {
	if (proxySwitcherHTML != "")
		document.getElementById("perTab").outerHTML = proxySwitcherHTML.replace("IDTEMPLATE", "perTab");

	if (typeof(tabStatus.subdomains) == 'undefined')
		return;

	if (tabStatus.subdomains.length === 0) {
		document.getElementById("table").style.display = "none";
	} else {
		document.getElementById("table").style.display = "inherit";
	}

	document.getElementById("tbody").innerHTML = '';
	for (let i=0; i<tabStatus.subdomains.length; i++) {
		let domain = tabStatus.subdomains[i];
		let html = "<tr>";
		html += "<td><p>" + domain + "</p></td>";
		html += "<td>" + proxySwitcherHTML.replace("IDTEMPLATE", "select_perm_" + i) + "</td>";
		html += "</tr>";

		document.getElementById("tbody").innerHTML += html;

	}
	displayRules();
}

function reloadRules() {
	loadRules(newRules => {
		rules = newRules;
		updateDisplay();
	});
}

function tabStatusReceived(info) {
	tabStatus = info;
	updateDisplay();
}

function updateTabProxy() {
	let v = document.getElementById("proxylist").value;
	browser.runtime.sendMessage({"instruction": "enable", "toEnable": v}).then(tabStatusReceived);
}

document.addEventListener("click", e => {
	if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}
});

document.addEventListener("change", e => {
	let name = e.target.id.split("_");
	if (name.length > 1) {
		let perm = name[1] == "perm";
		let id = name[2];
		let value = e.target.value;
		if (perm) {
			rule = tabStatus.subdomains[Number(id)];
			setRule(rule, value, newRules => {
				rules = newRules;
				updateDisplay();
			});
		}
	} else if (name[0] === "perTab") {
		browser.runtime.sendMessage({
			"instruction": "setTabOption",
			"toEnable": e.target.value
		}).then(tabStatusReceived);
	}
});

function proxySwitcherGenerated(button) {
	proxySwitcherHTML = button;
	updateDisplay();
}

window.onload = function() {
	generateProxyDropdown(proxySwitcherGenerated);
	browser.runtime.sendMessage({"instruction": "getinfo"}).then(tabStatusReceived);
}

browser.storage.onChanged.addListener((changes, areaName) => {
	if ("rules" in changes) {
		rules = changes.rules.newValue;
	}
	if ("proxies" in changes) {
		proxySwitcherHTML = generateDropdownFromProxies(changes.proxies.newValue);
	}
	updateDisplay();
});
reloadRules();
