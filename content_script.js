var generateContinueFunction = function(url) {
	return function() {
		chrome.runtime.sendMessage(
			{action: "whiteList", url: url},
			function(response) {
				window.location = url;
			}
		);
	}
}

var displayWarning = function(data) {
	window.stop();
	WarningPopup.create(data, function(warning) {
		warning.onContinue = generateContinueFunction(data.url);
		document.body.appendChild(warning.doc);
	});
};

var receiveMessage = function(request, sender, sendResponse) {
	if(request.action == "displayWarning") displayWarning(request);
};

chrome.runtime.onMessage.addListener(receiveMessage);
