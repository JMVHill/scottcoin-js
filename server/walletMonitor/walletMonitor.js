function WalletMonitor() {

		this.balance = 0;

}

WalletMonitor.prototype = {

	getbalance: function(){
		return this.balance
	}

}

module.exports = WalletMonitor;