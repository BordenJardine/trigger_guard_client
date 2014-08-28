var threshold = 2;
var perWhiteList = new WhiteList;
var tmpWhiteList = new WhiteList;

var communalList = new BlackList({
	'73q.com/': {
		avgRating: 12,
		ratings: 4
	}
});

var userRated = new BlackList({
	'poetv.com/the-hopper.php': {
		rating: 3
	}
});

communalList.find = function(url) {
	var item = this.lookup(url);
	if(item && (item.avgRating >= threshold)) {
		return item;
	}
	return false;
}

userRated.find = function(url) {
	var item = this.lookup(url);
	if(item && (item.rating >= threshold)) {
		item.type = 'userRated';
		return item;
	}
	return false;
};

var messageListener = function(request, sender, sendResponse) {
	if(sender.tab && request.action == 'whiteList') {
		perWhiteList.push(stripProtocol(request.url));
		sendResponse({success: true});
	}
};

var navListener = function(data) {
	var urlInfo = userRated.find(data.url) || communalList.find(data.url);

	if(
		(urlInfo) &&
		!perWhiteList.contains(data.url) &&
		!tmpWhiteList.contains(data.url)
	) { sendMessage({action: 'displayWarning', url: data.url, info: urlInfo }) }
};

var sendMessage = function(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
			if(response) console.log(response);
		});
	});
};

var stripProtocol = function(url) {
	return url.replace(/^https*:\/\/[www.]*/, '');
}

chrome.runtime.onMessage.addListener(messageListener);
chrome.webNavigation.onBeforeNavigate.addListener(navListener);
