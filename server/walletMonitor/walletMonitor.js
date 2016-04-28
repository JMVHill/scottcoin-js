function WalletMonitor() {

		this.balance = 0;
		this.unconfirmedBalance = 0;
		this.newAddress = '';
		this.txHash = '';

}

WalletMonitor.prototype = {

	getBalance: function(amount){
		this.balance = amount;
		return this.balance;
	},

	getUnconfirmedBalance: function(unconf){
			this.unconfirmedBalance = unconf;
			return this.unconfirmedBalance;
	},

	getNewAddress: function(address){
		this.newAddress = address;
		return this.newAddress;
	}

	pay: function(recipient) {

	}


}

module.exports = WalletMonitor;