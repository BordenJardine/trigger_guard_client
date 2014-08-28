var backGroundPage = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
	var button = document.querySelector('.clear_white_list');

	button.onclick = function() {
		backGroundPage.perWhiteList.clear();
	};
});
