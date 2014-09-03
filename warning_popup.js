var WarningPopup = function(options) {
	this.doc = document.createElement('div');
	this.url = options.url;
	this.info = options.info;
	this.type = options.type;
};

WarningPopup.prototype.setupLinks = function() {
	var self = this;
	var continueLink = this.doc.querySelector('.tg-Popup-continueLink');
	var backLink = this.doc.querySelector('.tg-Popup-backLink');

	continueLink.querySelector('.tg-Popup-url').innerHTML = tidyURL(this.url);
	backLink.onclick = function() {
		self.close();
	};

	continueLink.onclick = function() {
		self.close(function(){
			if(typeof self.onContinue == 'function') { self.onContinue() };
		});
	};
};

WarningPopup.prototype.setupRatings = function() {
	var container = this.doc.querySelector('.tg-Popup-ratings');
	var whoSpan = this.doc.querySelector('.tg-Popup-who');
	var template, who;

	if(this.type == 'user') {
		template = this.doc.querySelector('.tg-rating_template--you');
		who = 'you have';
	} else {
		template = this.doc.querySelector('.tg-rating_template--them');
		who = 'the community has';
	}

	whoSpan.innerHTML = who;

	for(var tag in this.info.tags) {
		var tagData = this.info.tags[tag];
		var newRating = template.cloneNode(true);
		newRating.className = 'tg-Rating';
		newRating.querySelector('.tg-Rating-score').innerHTML = tagData.rating;
		newRating.querySelector('.tg-Rating-tag').innerHTML = tag;
		if(tagData.ratings != undefined) {
			newRating.querySelector('.tg-Rating-count').innerHTML = tagData.ratings;
		}
		container.appendChild(newRating);
	}
};

WarningPopup.prototype.injections = function() {
	this.setupLinks();
	this.setupRatings();
};

WarningPopup.prototype.close = function(done) {
	this.doc.parentNode.removeChild(this.doc);
	if(typeof done == 'function') { done(); }
};

WarningPopup.prototype.loadHTML = function(done) {
	var self = this;
	function reqListener() {
		self.doc.innerHTML = this.responseText;
		self.popupWindow = self.doc.querySelector('.tg-Popup');
		done();
	}

	var req = new XMLHttpRequest();
	req.onload = reqListener;
	req.open("get", chrome.extension.getURL('warning.html'), true);
	req.send();
};

WarningPopup.prototype.reposition = function() {
	var popupWindow = this.doc.querySelector('.tg-Popup');
	var w = popupWindow.offsetWidth,
		h = popupWindow.offsetHeight;

	popupWindow.style['margin-top'] = ((h / 2) * -1) + 'px';
	popupWindow.style['margin-left'] = (( w / 2) * -1) + 'px';
};

var tidyURL = function(url) {
	return stripProtocol(stripQueryParams(url));
};

var stripProtocol = function(url) {
	return url.replace(/^https*:\/\/[www.]*/, '');
};

var stripQueryParams = function(url) {
	return url.replace(/\?.*/, '');
};

WarningPopup.create = function(options, done) {
	var warningPopup = new WarningPopup(options);
	warningPopup.loadHTML(function() {
		warningPopup.injections();
		done(warningPopup);
	});
};
