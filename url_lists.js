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
		if(this.entries.indexOf(item) == -1) { this.entries.push(item) };
	}
};


var BlackList = function(defaultList) {
	this.entries = (defaultList) ? defaultList : {};
}

BlackList.prototype.looseLookup = function(item) {
	list = Object.keys(this.entries);
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
		return item;
	}
	return false;
}

var looseIndexOf = function(arr, item) {
	for(var i = 0; i < arr.length; i++) {
		if(item.indexOf(arr[i]) != -1 ) { return i; }
	}
	return -1;
}

