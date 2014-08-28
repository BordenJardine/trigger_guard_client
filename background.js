var whiteList = [];
var blackList = ['http://www.73q.com/'];

var clearWhiteList = function() {
	whiteList = [];
};

var pushUnique = function(list, item) {
	if(list.indexOf(item) == -1) { list.push(item) };
};

var messageListener = function(request, sender, sendResponse) {
	if(sender.tab && request.action == 'whiteList') {
		pushUnique(whiteList, request.url);
		sendResponse({success: true});
	}
};

var navListener = function(data) {
	if(
		blackList.indexOf(data.url) != -1 &&
		whiteList.indexOf(data.url) == -1
	) { sendMessage({action: 'displayWarning', url: data.url }); }
}

var sendMessage = function(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
			if(response) console.log(response);
		});
	});
};

chrome.runtime.onMessage.addListener(messageListener);
chrome.webNavigation.onBeforeNavigate.addListener(navListener);
