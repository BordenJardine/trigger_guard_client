var backGroundPage = chrome.extension.getBackgroundPage();

var displayUserRating = function(tag, rating) {
	var container = document.querySelector('.tg-Action-ratingContainer'),
		addNew = container.querySelector('.tg-Action-addNew'),
		template = container.querySelector('.tg-Action-oldRatingTemplate'),
		ratingEl = template.cloneNode(true);

	ratingEl.querySelector('.tg-Rating-score').innerHTML = rating;
	ratingEl.querySelector('.tg-Rating-tag').innerHTML = tag;

	addNew.parentNode.insertBefore(ratingEl, addNew);
	ratingEl.className = 'tg-Rating';
}


var getTabUrl = function(done) {
	chrome.tabs.getSelected(null, function(tab) {
		done(tab.url);
	});
};


var loadUserRatings = function(url) {
	info = backGroundPage.userList.find(url);
	if(!info) { return };
	for(tag in info.tags) {
		displayUserRating(tag, info.tags[tag].rating);
	}
}


var loadWhiteListLinks = function(url) {
	if(backGroundPage.perWhiteList.contains(url)) {
		setupRemoveWhiteListLink(url);
	} else {
		if(backGroundPage.blackListInfo(url)) {
			setupAddWhiteListLink(url);
		}
	}
};


var setupAddWhiteListLink = function(url) {
	var link = document.querySelector('.tg-addToWhiteList');
	link.className = link.className.replace('tgu-hidden', '');
	link.onclick = function() {
		backGroundPage.perWhiteList.push(url);
		link.className += ' tgu-hidden';
		setupRemoveWhiteListLink(url);
	}
};


var setupRemoveWhiteListLink = function(url) {
	var link = document.querySelector('.tg-removeFromWhiteList');
	link.className = link.className.replace('tgu-hidden', '');
	link.onclick = function() {
		backGroundPage.perWhiteList.remove(url);
		link.className += ' tgu-hidden';
		setupAddWhiteListLink(url);
	}
};


document.addEventListener('DOMContentLoaded', function() {
	getTabUrl(function(url) {
		loadWhiteListLinks(url);
		loadUserRatings(url);
		//setupNewRatingLink(url);
	});
});

