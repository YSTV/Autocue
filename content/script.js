var connection;
var rtl = false;
var edit = false;

var time = 0;
var time2 = 0;

function connect() {
	connection = new WebSocket('ws://ystv.co.uk:1234/autocue', ['soap', 'xmpp']);
	connection.binaryType = "arraybuffer";
	connection.onopen = onWSOpen;
	connection.onerror = onWSError;
	connection.onclose = onWSClose;
	connection.onmessage = onWSMessage;
}
connect();

function onWSOpen() {
	
};

function onWSError(error) {
	console.log('WebSocket Error ' + error);
};

function onWSClose() {
	connect();
}

function onWSMessage(e) {
	var arr = new Uint8Array(e.data);
	var str = "";

	for (var i = 1; i < arr.length; i++) {
		str += String.fromCharCode(arr[i]);
	}

	packetType = parseInt(String.fromCharCode(arr[0]));
	switch (packetType) {
		case 1:
			document.getElementById('edit_txt').value = str;
			document.getElementById('content').innerHTML = str
					.replace(/'''''([a-zA-Z0-9_ \n]*)'''''/g, "<b><i>$1</i></b>")
					.replace(/'''([a-zA-Z0-9_ \n]*)'''/g, "<b>$1</b>")
					.replace(/''([a-zA-Z0-9_ \n]*)''/g, "<i>$1</i>")
					.replace(/\n/g, "<br />");
			break;
		case 2:
			document.getElementById('content').style.fontSize = str + "px";
			document.getElementById('content').style.lineHeight = Math.ceil(parseInt(str) * 1.1) + "px";
			break;
		case 3:
			if (time2 < new Date().getTime()) {
				window.scrollTo(0, -str);
				time = new Date().getTime() + 1000;
			}
			break;
	}
};

function sendPacket(a, b) {
	var bytearray = new Uint8Array(2);
	bytearray[0] = a;
	bytearray[1] = b;
	connection.send(bytearray.buffer);
}

function str2ab(str) {
	var bufView = new Uint8Array(str.length + 1);
	bufView[0] = 4;
	for (var i = 1, strLen = str.length; i <= strLen; i++) {
		bufView[i] = str.charCodeAt(i - 1);
	}
	return bufView.buffer;
}

document.onkeypress = function (e) {
	e = e || window.event;

	if (e.keyCode == 96) {
		if (edit) {
			connection.send(str2ab(document.getElementById('edit_txt').value));
		}

		edit = !edit;
		document.getElementById('edit').className = edit ? "show" : "";
	}
	if (!edit) {
		if (e.keyCode == 114) { // "r"
			rtl = !rtl;
			document.getElementById('content').className = rtl ? "rtl" : "";
		} else if (e.keyCode == 61) { // "+"
			sendPacket(3, 1);
		} else if (e.keyCode == 45) { // "-"
			sendPacket(3, 2);
		}
	}
};

$(window).scroll(function () {
	if (time < new Date().getTime()) {
		str = (-$(window).scrollTop()).toString();

		var bufView = new Uint8Array(str.length + 1);
	        bufView[0] = 5;
        	for (var i = 1, strLen = str.length; i <= strLen; i++) {
                	bufView[i] = str.charCodeAt(i - 1);
	        }

		connection.send(bufView.buffer);

		time2 = new Date().getTime() + 1000;
	}
});
