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

var buttonHTML = "";
var latestInfo = {};
var rules = {};

function applyRules() {
	if (typeof(latestInfo.overwritten_status) != 'undefined') {
		document.getElementById("perTab").value = latestInfo.overwritten_status;
	} else {
		document.getElementById("perTab").value = "null";
	}

	for (rule in rules) {
		let index = latestInfo.subdomains.indexOf(rule);
		if (index != -1) {
			document.getElementById("select_perm_" + index).value = rules[rule];
		}
	}

}

function updateDisplay() {

	document.getElementById("perTab").outerHTML = buttonHTML.replace("IDTEMPLATE", "perTab");

	if (typeof(latestInfo.subdomains) == 'undefined')
		return;

	document.getElementById("tbody").innerHTML = '';
	for (let i=0; i<latestInfo.subdomains.length; i++) {
		let domain = latestInfo.subdomains[i];
		let html = "<tr>";
		html += "<td>" + domain + "</td>";
		html += "<td>" + buttonHTML.replace("IDTEMPLATE", "select_perm_" + i) + "</td>";
		html += "</tr>";

		document.getElementById("tbody").innerHTML += html;

	}
	applyRules();
}

function reloadRules() {
	loadRules(newRules => {
		rules = newRules;
		updateDisplay;
	});
}

function infoReceived(info) {
	latestInfo = info;
	updateDisplay();
}

function updateTabProxy() {
	let v = document.getElementById("proxylist").value;
	browser.runtime.sendMessage({"instruction": "enable", "toEnable": v}).then(infoReceived);
}

document.addEventListener("click", e => {
	if (e.target.id == "settings"){
		browser.runtime.openOptionsPage();
	}
});

document.addEventListener("change", e => {
	let name = e.target.id.split("_");
	console.log(name);
	if (name.length > 1) {
		let perm = name[1] == "perm";
		let id = name[2];
		let value = e.target.value;
		if (perm) {
			rule = latestInfo.subdomains[Number(id)];
			if (value != 'null') {
				rules[rule] = value;
			} else {
				delete rules[rule];
			}
			browser.storage.sync.set({"rules": rules});

		}
	} else if (name[0] === "perTab") {
		console.log("temp");
		browser.runtime.sendMessage({"instruction": "setTabOption", "toEnable": e.target.value}).then(infoReceived);
	}
});

function loadButtons(proxies) {
	html = "<select id=\"IDTEMPLATE\">"
	html += "<option value=\"null\">Default</option>";
	for (let proxy in proxies) {
		let p = proxies[proxy];
		html += "<option value=\"" +
			proxy + "\">" +
			p.name + "</option>";
	}
	html += "</select>"
	buttonHTML = html;
	updateDisplay();
}

window.onload = function() {
	loadProxies(loadButtons);
	browser.runtime.sendMessage({"instruction": "getinfo"}).then(infoReceived);
}

browser.storage.onChanged.addListener((changes, areaName) => {
	loadProxies(loadButtons);
	reloadRules();
});
reloadRules();
