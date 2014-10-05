var backGroundPage = chrome.extension.getBackgroundPage();
var URL;

var displayUserRating = function(tag, rating) {
	var container = document.querySelector('.tg-Action-ratingContainer'),
		addNew = container.querySelector('.tg-Action-addNew'),
		template = container.querySelector('.tg-Action-oldRatingTemplate'),
		ratingEl = template.cloneNode(true);
		remove = ratingEl.querySelector('.tg-Rating-remove');

	ratingEl.querySelector('.tg-Rating-score').innerHTML = rating;
	ratingEl.querySelector('.tg-Rating-tag').innerHTML = tag;

	addNew.parentNode.insertBefore(ratingEl, addNew);
	ratingEl.className = 'tg-Rating tg-RatingEl';

	remove.onclick = function() {
		backGroundPage.userList.remove(URL, tag);
		remove.onlick = undefined;
		redisplayRatingList();
	}
}


var domRemove = function(el){
	el.parentNode.removeChild(el);
};


var getTabUrl = function(done) {
	chrome.tabs.getSelected(null, function(tab) {
		done(tab.url);
	});
};


var loadUserRatings = function() {
	info = backGroundPage.userList.find(URL);
	if(!info) { return };
	for(tag in info.tags) {
		displayUserRating(tag, info.tags[tag].rating);
	}
}


var loadWhiteListLinks = function() {
	if(backGroundPage.perWhiteList.contains(URL)) {
		setupRemoveWhiteListLink();
	} else {
		if(backGroundPage.blackListInfo(URL)) {
			setupAddWhiteListLink();
		}
	}
};


var displayRatingList = function() {
		loadWhiteListLinks();
		loadUserRatings();
		setupNewRatingLink();
}

var redisplayRatingList = function() {
	resetRatingList();
	displayRatingList();
};

var resetRatingList = function() {
	var ratings = document.querySelectorAll('tg-ratingEl');

		for(var i = 0; i <= ratings.length; i++) {
			console.log(ratings[i]);
			domRemove(ratings[i]);
		}
};

var setupAddWhiteListLink = function() {
	var link = document.querySelector('.tg-addToWhiteList');
	link.className = link.className.replace('tgu-hidden', '');
	link.onclick = function() {
		backGroundPage.perWhiteList.push(URL);
		link.className += ' tgu-hidden';
		setupRemoveWhiteListLink();
	}
};

var showNewRatingForm = function() {
	var container = document.querySelector('.tg-Action-ratingContainer'),
		addNew = container.querySelector('.tg-Action-addNew'),
		template = container.querySelector('.tg-Action-newRatingTemplate'),
		ratingEl = template.cloneNode(true),
		saveButton = ratingEl.querySelector('.tg-newRating-save'),
		removeButton = ratingEl.querySelector('.tg-newRating-remove'),
		inputTag = ratingEl.querySelector('.tg-newRating-tag'),
		inputSeverity = ratingEl.querySelector('.tg-newRating-severity');

	saveButton.onclick = function() {
		var rating = inputSeverity.options[inputSeverity.selectedIndex].value;
		backGroundPage.userList.add(URL, inputTag.value, {rating: rating});
		redisplayRatingList();
	};

	removeButton.onclick = function() {
		removeButton.onclick = undefined;
		saveButton.onclick = undefined;
		domRemove(ratingEl);
	}

	addNew.parentNode.insertBefore(ratingEl, addNew);
	ratingEl.className = 'tg-newRating tg-ratingEl';
};

var setupNewRatingLink = function() {
	var addNew = document.querySelector('.tg-Action-addNew');

	addNew.onclick = function() {
		showNewRatingForm();
	};
}

var setupRemoveWhiteListLink = function() {
	var link = document.querySelector('.tg-removeFromWhiteList');
	link.className = link.className.replace('tgu-hidden', '');
	link.onclick = function() {
		backGroundPage.perWhiteList.remove(URL);
		link.className += ' tgu-hidden';
		setupAddWhiteListLink();
	}
};


document.addEventListener('DOMContentLoaded', function() {
	getTabUrl(function(url) {
		URL = url;
		displayRatingList();
	});
});
