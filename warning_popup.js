var WarningPopup = function(options) {
	this.doc = document.createElement('div');
	this.doc.className = "tg-positionAbsolute";
	this.url = options.url;
	this.urlInfo = options.info;
}

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
}

WarningPopup.prototype.injections = function() {
	this.setupLinks();
	this.setupRatings();
}

WarningPopup.prototype.close = function(done) {
	this.doc.parentNode.removeChild(this.doc);
	if(typeof done == 'function') { done(); }
};

WarningPopup.prototype.loadHTML = function(done) {
	var self = this;
	function reqListener() {
		self.doc.innerHTML = this.responseText;
		done();
	}

	var req = new XMLHttpRequest();
	req.onload = reqListener;
	req.open("get", chrome.extension.getURL('warning.html'), true);
	req.send();
}

var tidyURL = function(url) {
	return stripProtocol(stripQueryParams(url));
}

var stripProtocol = function(url) {
	return url.replace(/^https*:\/\/[www.]*/, '');
}

var stripQueryParams = function(url) {
	return url.replace(/\?.*/, '');
}

WarningPopup.create = function(options, done) {
	var warningPopup = new WarningPopup(options);
	warningPopup.loadHTML(function() {
		warningPopup.injections();
		done(warningPopup);
	});
}
