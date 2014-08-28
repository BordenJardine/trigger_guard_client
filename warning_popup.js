var WarningPopup = function(options) {
	this.doc = document.createElement('div');
	this.doc.className = "tg-positionAbsolute";
	this.url = options.url;
}

WarningPopup.prototype.injections = function() {
	var node = this.doc;
	var continueLink = this.doc.querySelector('.tg-ContinueLink');
	var self = this;
	continueLink.onclick = function() {
		if(node.parentNode) {
			node.parentNode.removeChild(node);
		}
		if(typeof self.onContinue == 'function') { self.onContinue() };
	};
}

WarningPopup.prototype.loadHTML = function(done) {
	var self = this;
	function reqListener() {
		console.log(this.responseText);
		self.doc.innerHTML = this.responseText;
		done();
	}

	var req = new XMLHttpRequest();
	req.onload = reqListener;
	req.open("get", chrome.extension.getURL('warning.html'), true);
	req.send();
}

WarningPopup.create = function(options, done) {
	var warningPopup = new WarningPopup(options);
	warningPopup.loadHTML(function() {
		warningPopup.injections();
		done(warningPopup);
	});
}
