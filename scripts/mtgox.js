var conn = io.connect('https://socketio.mtgox.com/mtgox');

var date;
var tradetime;

conn.on('connect', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=green>Connected to Mt.Gox</font>";
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "ticker"
	});
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "depth"
	});
	conn.send({
	  "op": "mtgox.subscribe",
	  "type": "trade"
	});
});

conn.on('message', function(data) {
	if ('private' === data.op) {
		if ('trade' === data.private && 'USD' === data.trade.price_currency) {
			date = new Date(data.trade.date*1000);
			tradetime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			document.getElementById("tradepricelabel").innerHTML = "Last trade price: ";
			document.getElementById("tradeprice").innerHTML = tradetime + " - " + data.trade.price.toString();
		}
		if ('depth' === data.private) {
			if ('ask' === data.depth.type_str) {
				document.getElementById("askpricelabel").innerHTML = "Ask price:";
				document.getElementById("askprice").innerHTML = data.depth.price.toString();
			} else {
				document.getElementById("bidpricelabel").innerHTML = "Bid price";
				document.getElementById("bidprice").innerHTML = data.depth.price.toString();
			}
		}
	}
});

conn.on('heartbeat', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=blue>Heartbeat</font>";
});

conn.on('connecting', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=red>Connecting...</font>";
});

conn.on('disconnect', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=red>Not connected to Mt.Gox</font>";
});

conn.on('error', function(data) {
	document.getElementById("statuslabel").innerHTML = "<font color=red>Error connecting to Mt.Gox</font>";
});