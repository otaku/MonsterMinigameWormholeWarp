// ==UserScript==
// @name Ye Olde Megajump (Auto-updating)
// @namespace https://github.com/YeOldeWH/MonsterMinigameWormholeWarp
// @description A script that runs the Steam Monster Minigame for you.  Now with megajump.  Brought to you by the Ye Olde Wormhole Schemers and DannyDaemonic
// @version 6.0.0
// @match *://steamcommunity.com/minigame/towerattack*
// @match *://steamcommunity.com//minigame/towerattack*
// @grant GM_xmlhttpRequest
// @updateURL https://raw.githubusercontent.com/YeOldeWH/MonsterMinigameWormholeWarp/master/autoPlay.user.js
// @downloadURL https://raw.githubusercontent.com/YeOldeWH/MonsterMinigameWormholeWarp/master/autoPlay.user.js
// ==/UserScript==

var loaderVersion = '6.0.0';

function repoUser() {
	var user = 'YeOldeWH';

	try {
		var repo = localStorage.getItem('steamdb-minigame-wormholers/githubRepo');
		if (repo) {
			user = repo;
		}
	} catch (e) {}

	return user;
}

function latestCommitSHA(callback) {
	var user = repoUser();

	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://api.github.com/repos/' + user + '/MonsterMinigameWormholeWarp/commits?v=' + new Date().getTime(),
		onload: function (response) {
			var commits = JSON.parse(response.responseText);

			callback(commits && commits[0] && commits[0].sha ? commits[0].sha : null);
		}
	});
}


function checkForUpdates(currentVersion) {
	function check() {
		latestCommitSHA(function (sha) {
			if (currentVersion !== sha) window.location.reload(true);
		});

		window.setTimeout(check, 5 * 60 * 1000);
	}

	// Display the version
	var shortVersion = currentVersion.substr(0, 10);
	var versionDiv = document.createElement('div');
	versionDiv.innerHTML = '<div style="' +
		'color: white; position: fixed; right: 1em; ' +
		'border: 1px solid white; padding: 2px; background: black;' +
		'bottom: 1em; z-index: 9999;">Loader: ' + loaderVersion + ' Script: ' + shortVersion + '</div>';
	document.body.appendChild(versionDiv);

	window.setTimeout(check, 15 * 60 * 1000);
}


function loadScript() {
	var user = repoUser();

	latestCommitSHA(function (sha) {
		GM_xmlhttpRequest ({
			method: 'GET',
			url: 'https://raw.githubusercontent.com/' + user + '/MonsterMinigameWormholeWarp/' + sha + '/autoplay.noUpdate.user.js?v=' + new Date().getTime(),
			onload: function (response) {
				var scriptElement = document.createElement('script');
				scriptElement.type = 'text/javascript';
				scriptElement.innerHTML = response.responseText;
				document.body.appendChild(scriptElement);
			}
		});

		checkForUpdates(sha);
	});
}

loadScript();
