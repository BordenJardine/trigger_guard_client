var WhiteList = function(defaultList) {
	this.entries = (defaultList) ? defaultList : [];
};

WhiteList.prototype = {
	clear: function() {
		this.entries = [];
	},
	contains: function(item) {
		for(var i = 0; i < this.entries.length; i++) {
			if(item.indexOf(this.entries[i]) != -1 ) { return true; }
		}
		return false;
	},
	push: function(item) {
		item = stripProtocol(item);
		if(this.entries.indexOf(item) == -1) { this.entries.push(item) };
	},
	remove: function(item) {
		for(var i = 0; i < this.entries.length; i++) {
			if(item.indexOf(this.entries[i]) != -1 ) {
				this.entries.splice(i, 1);
			}
		}
	}
};


var BlackList = function(defaultList) {
	this.entries = (defaultList) ? defaultList : {};
}

BlackList.prototype.add = function(url, tag, info) {
	url = stripProtocol(url);
	if(!this.entries[url]) {
		this.entries[url] = {tags: {}};
	}
	this.entries[url].tags[tag] = info;
};

BlackList.prototype.looseLookup = function(item) {
	var list = Object.keys(this.entries);

	var index = looseIndexOf(list, item);
	if(index != -1) {
		return this.entries[list[index]];
	}
	return false;
}

BlackList.prototype.find = function(item) {
	var candidate = this.looseLookup(item);
	if(!candidate || !this.matchCriteria) { return false; }

	if(this.matchCriteria(candidate)) {
		return candidate;
	}
	return false;
}

BlackList.prototype.remove = function(url, tag, info) {
}

var looseIndexOf = function(arr, item) {
	for(var i = 0; i < arr.length; i++) {
		if(item.indexOf(arr[i]) != -1 ) { return i; }
	}
	return -1;
}

var stripProtocol = function(url) {
	return url.replace(/^https*:\/\/[www.]*/, '');
}

