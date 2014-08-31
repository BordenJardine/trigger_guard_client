var threshold = 2;
var perWhiteList = new WhiteList;
var tmpWhiteList = new WhiteList;

var communalList = new BlackList({
	'73q.com/': {
		tags: {
			'scorpions': {
				rating: 3,
				ratings: 4
			},
			'butts': {
				rating: 4,
				ratings: 12
			}
		}
	}
});

var userRated = new BlackList({
	'poetv.com/the-hopper.php': {
		tags: {
			'scorpions': {
				rating: 3
			}
		}
	}
});

var ratingCriteria = function(item) {
	for(i in item.tags) {
		if(item.tags[i].rating > threshold) {
			return true;
		}
	}
	return false;
}

communalList.matchCriteria = ratingCriteria;
userRated.matchCriteria = ratingCriteria;

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
