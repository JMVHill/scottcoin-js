
const SOCKETS = {

    // Define socket message constants
    SCT_SND__NEW_TX         : 'newtransactions',
    SCT_SND__NEW_BLOCK      : 'newblocks',
    SCT_SND__UPDATE_TX      : 'updatetransactions',
    SCT_SND__TX_LIST        : 'sendtransactions',
    SCT_SND__BLOCK_LIST     : 'sendblocks',
    SCT_REC__TX_LIST        : 'gettransactions',
    SCT_REC__BLOCK_LIST     : 'getblocks',
    SCT_REC__TX_ALL         : 'alltransactions',
    SCT_REC__BLOCK_ALL      : 'allblocks',

    //Wallet contstants
    SCT_SND__BALANCE        : 'sendbalance',
    SCT_SND__UNCONFBALANCE  : 'sendunconfirmedbalance',
    SCT_SND__GET_ADDR       : 'sendnewaddress',
    SCT_SND__PAYMENT        : 'sendtoaddress', 
    SCT_REC__BALANCE        : 'getbalance',
    SCT_REC__UNCONFBALANCE  : 'getunconfirmedbalance',
    SCT_REC__GET_ADDR       : 'getnewaddress',
    SCT_REC__PAYMENT        : 'confirmedpayment' 

}

module.exports = SOCKETS;