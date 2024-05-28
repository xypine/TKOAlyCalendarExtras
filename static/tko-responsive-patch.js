// ==UserScript==
// @name         TKO-äly flexbox patch
// @namespace    https://tko-extras.ruta.fi/
// @version      2024-05-28
// @description  Makes the TKO-äly website responsive and HTML5 compliant (todo?)
// @author       Elias Eskelinen <elias.eskelinen@pm.me>
// @match        https://tko-aly.fi/*
// @match        https://www.tko-aly.fi/*
// @match        https://members.tko-aly.fi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @updateURL    https://tko-extras.ruta.fi/tko-responsive-patch.js
// @downloadURL  https://tko-extras.ruta.fi/tko-responsive-patch.js
// @supportURL   https://github.com/xypine/TKOAlyCalendarExtras
// @grant        none
// ==/UserScript==

(() => {
	console.info("Adding HTML5 DOCTYPE");
	const newDoctype = document.implementation.createDocumentType('html', '', '');
	document.doctype.parentNode.replaceChild(newDoctype, document.doctype);


	console.info("Patching layout 1/3");
	// rename content to content_container
	const content = document.querySelector("#content");
	if (!content) {
		console.warn("content not found");
		return;
	};
	content.id = "content_container";
	// create a main element and move all children of content_container to it
	// except for #header, #sponsor and #footer
	const main = document.createElement("main");
	const header = document.querySelector("#header");
	const sponsor = document.querySelector("#sponsor");
	const footer = document.querySelector("#footer");
	const toMove = [...content.children].filter(child => ![header, sponsor, footer].includes(child));
	for (const child of toMove) {
		console.log("Moving child", child);
		main.appendChild(child);
	}
	// insert main element after header
	main.id = "content";
	header.insertAdjacentElement("afterend", main);

	console.info("Patching layout 2/3");
	const events_menu = document.querySelector("#events_menu");
	if (!events_menu) {
		console.warn("events_menu not found");
		// this might be a non-members page
		console.info("Replacing header with the one from members");
		header.innerHTML = `
			<a class="header__link" href="https://tko-aly.fi/">
			  <img class="header__logo" src="https://members.tko-aly.fi/img/logo-150.png" alt="TKO-äly ry logo">
			</a>
			<h1 class="header__title">
			  <span class="whitetext">Helsingin yliopiston tietojenkäsittelytieteen </span>
			  <span class="blacktext">opiskelijoiden ainejärjestö</span>
			</h1>
		`;
	}
	else {
		const members_main = document.querySelector("#members_main");
		if (!members_main) {
			console.warn("members_main not found");
			return;
		};
		const events_parent = events_menu.parentElement;

		const events_container = document.createElement("div");
		events_container.id = "events_container";
		events_parent.insertBefore(events_container, events_menu);
		for (const new_child of [events_menu, members_main]) {
			events_container.appendChild(new_child);
		}
	}

	console.info("Patching layout 3/3");
	const inputs_to_fix = ["username", "password"];
	const login = document.querySelector("#login");
	for (const input_name of inputs_to_fix) {
		const input = login?.querySelector(`input[name="${input_name}"]`);
		const label = login?.querySelector(`label[for="${input_name}"]`);
		if (!input) {
			console.warn(`input[name="${input_name}"] not found`);
			continue;
		};
		if (!label) {
			console.warn(`label[for="${input_name}"] not found`);
			continue;
		}
		// move input inside label
		label.appendChild(input);
		// reset label for
		label.for = "";
		label.classList.add("augmented");
	}

	console.info("Adding hamburger menu");
	// select items from #menu
	const menu_container = document.querySelector("#menu > ul");
	if (!menu_container) {
		console.warn("menu not found");
		return;
	};
	const hamburger = document.createElement("div");
	hamburger.id = "mobile_menu";
	const hamburger_button = document.createElement("button");
	hamburger_button.textContent = "☰";
	hamburger.appendChild(hamburger_button);
	const hamburger_content = document.createElement("div");
	hamburger_content.id = "mobile_menu_content";
	hamburger.appendChild(hamburger_content);
	// select text and href from each item
	for (const item of menu_container.children) {
		const text = item.textContent.trim();
		const href = item.querySelector("a")?.href;
		if (!text || !href) {
			console.warn("text or href not found");
			continue;
		};
		const link = document.createElement("a");
		link.href = href;
		link.textContent = text;
		hamburger_content.appendChild(link);
	}
	// append hamburger to #header
	header.appendChild(hamburger);

	console.info("Patching meta tags");
	const meta_responsive = document.createElement("meta");
	meta_responsive.name = "viewport";
	meta_responsive.content = "width=device-width, initial-scale=1";
	document.head.appendChild(meta_responsive);

	console.info("Patching styles");
	const styles = document.createElement("link");
	styles.rel = "stylesheet";
	styles.href = "https://tko-extras.ruta.fi/tko-responsive-patch.css";
	document.head.appendChild(styles);

	console.info("Patching done! 🎉");
})();
