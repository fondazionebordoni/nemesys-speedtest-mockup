var bytesToDownload =  5242880;
var host = "192.168.1.180:60100";
var totalBytes = 0;
var startTime = Date.now();
var xhr;

var downloadStream = function() {
	
	xhr = new XMLHttpRequest();

	var prevBytes = 0;
	/*
	xhr.onprogress = function(event) {
		addBytes(event.loaded);
		console.log("progress");
	};*/
	
	xhr.onload = function(event) {
		xhr.abort();
		addBytes(event.loaded);
		downloadStream();
	};
	
	xhr.onabort = function(event) {
		addBytes(event.loaded);
	};
	
	var addBytes = function(newTotalBytes) {
		totalBytes += newTotalBytes - prevBytes;
		prevBytes = newTotalBytes;
	};

	var req = {
		request:'download',
		data_length: bytesToDownload
	};

	var jsonReq = JSON.stringify(req);
	var url = 'http://' + host + '?r=' + Math.random() + "&data=" + encodeURIComponent(jsonReq);
	xhr.open('GET', url);
	xhr.send();
}

downloadStream();

var interval = setInterval(function() {
	var time = Date.now();
	var elapsedTime = time - startTime;
	var speedInMbps = (totalBytes/125)/elapsedTime;
	postMessage(speedInMbps.toString() + " " + totalBytes.toString());
	console.log(time);
	if(elapsedTime > 10000) {
		xhr.abort();
		clearInterval(interval);
		close();
	}
}, 100);