

function AccountClient(money, deposits, withdrawals, operation) {
	this.money = money;
	this.listDeposits = deposits;
	this.listWithdrawal = withdrawals;
	this.operation = operation;
}

AccountClient.prototype.depositeMoney = function(money) {
	this.money += parseInt(money);

	item = {'amount': money, time: new Date(), operation: this.operation};
	this.listDeposits.push(item)
	return item;
}

AccountClient.prototype.incrementOperation = function() {
	this.operation++;
}

AccountClient.prototype.withdrawalMoney = function(money) {

	if (this.money <= money)
		throw "* Not enought money";
	item = {'amount': money, time: new Date(), operation: this.operation};
	this.money -= money;
	this.listWithdrawal.push(item);
	return item;
}

var Singleton = (function() {
	var instance;

	function createInstance() {
		var userAcount = localStorage.getItem('UserAccount');
	
		if (userAcount == null)
			userAcount = new AccountClient(200, [], [], 0);
		else
		{
			userSave = JSON.parse(userAcount)
			userAcount = new AccountClient(
				userSave.money,
				userSave.listDeposits,
				userSave.listWithdrawal,
				userSave.operation);
		}
		return userAcount;
	}

	return {
		 getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
	}
})();


function runProgramme() {
	let userAcount = Singleton.getInstance();

	function updateMoney() {
		let currentMoney = document.getElementById("currentMoney");

		currentMoney.textContent = "" + userAcount.money;
	}
	updateMoney();


	function updateDisplayOperations(type, item) {

		let refList;
		if (type == "withdrawal")
			refList = document.getElementById("listWithdrawal");
		else if (type == "deposit")
			refList = document.getElementById("listDeposit");

		var newTr = document.createElement("tr");
		var newTdAction = document.createElement("td");
		var newTdTime = document.createElement("td");
		var newTdAmount = document.createElement("td");

		newTdAction.textContent = type;
		newTdTime.textContent = item.time;
		newTdAmount.textContent = item.amount;

		newTr.appendChild(newTdAction);
		newTr.appendChild(newTdTime);
		newTr.appendChild(newTdAmount);
		refList.appendChild(newTr)
	}

	function loadOperations() {
		userAcount.listDeposits.forEach((elem) => {
			updateDisplayOperations("deposit", elem)
		})

		userAcount.listWithdrawal.forEach((elem) => {
			updateDisplayOperations("withdrawal", elem)
		})
	}

	function update(type, item) {
		userAcount.incrementOperation();
		updateMoney();
		save();
		updateDisplayOperations(type, item);
	}

	function save() {
		localStorage.setItem('UserAccount', JSON.stringify(userAcount));
	}

	function depositeMoney() {
		let refInputMoney = document.getElementById("moneyDepot");
		let item = userAcount.depositeMoney(refInputMoney.value);
		update("deposit", item);
	}

	function withdrawalMoney() {

		document.getElementById("errWithdrawal").textContent = "";
		try {
			let refInputMoney = document.getElementById("moneyWithdrawal");
			let item = userAcount.withdrawalMoney(refInputMoney.value);	
			update("withdrawal", item);
		}
		catch (e) {
			document.getElementById("errWithdrawal").textContent = e;
		}
	}

	function switchTab(pageTag) {
		const listTab = document.getElementsByTagName("Section");
		const listli = document.getElementById("ul_nav").getElementsByTagName("li");

		const ex = document.getElementById(pageTag);
		document.getElementById("errWithdrawal").textContent = "";
		for (let i = 0; i < listTab.length; i++) {
			listTab[i].classList.add("tabHidden");
			if (listTab[i].id == pageTag) {
				listTab[i].classList.remove("tabHidden");
			}
		}

		for (let i = 0; i < listli.length; i++) {
			listli[i].classList.remove("active");
			if (listli[i].id == "li" + pageTag) {
				listli[i].classList.add("active");
			}
		}
	}

	function debugUser() {
		console.log(userAcount);
	}

	runProgramme.updateMoney = updateMoney;
	runProgramme.switchTab = switchTab;
	runProgramme.depositeMoney = depositeMoney;
	runProgramme.withdrawalMoney = withdrawalMoney;
	runProgramme.debugUser = debugUser;

	loadOperations();
}
runProgramme();