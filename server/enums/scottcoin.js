
const scottcoin = {

	// Define blockchain constants
	GENESIS_HASH 		    : '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',

	// Define socket message constants
	SCT_SND__NEW_TX 		: 'newtransactions',
	SCT_SND__NEW_BLOCK 		: 'newblocks',
	SCT_SND__UPDATE_TX 		: 'updatetransactions',
	SCT_SND__TX_LIST 		: 'sendtransactions',
	SCT_SND__BLOCK_LIST 	: 'sendblocks',
	SCT_REC__TX_LIST 		: 'gettransactions',
	SCT_REC__BLOCK_LIST 	: 'getblocks',
	SCT_REC__TX_ALL 		: 'alltransactions',
	SCT_REC__BLOCK_ALL 		: 'allblocks'
}

module.exports = scottcoin;
