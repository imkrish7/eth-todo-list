// import abi from '../build/contracts/TodoList.json';
// const Web3 = require('web3');

const App = {
	contracts: {},
	loading: false,
	load: async () => {
		console.log('app loading...');
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
		// await App.renderTask();
	},
	loadWeb3: async () => {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			window.alert('Please connect to Metamask.');
		}
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				await ethereum.enable();
				// Acccounts now exposed
				web3.eth.sendTransaction(
					{
						/* ... */
					}
				);
			} catch (error) {
				// User denied account access...
			}
		} else if (window.web3) {
			// Legacy dapp browsers...
			App.web3Provider = web3.currentProvider;
			window.web3 = new Web3(web3.currentProvider);
			// Acccounts always exposed
			web3.eth.sendTransaction(
				{
					/* ... */
				}
			);
		} else {
			// Non-dapp browsers...
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	},

	loadAccount: async () => {
		// Set the current blockchain account
		App.account = web3.eth.accounts[0];
	},

	loadContract: async () => {
		// Create a JavaScript version of the smart contract
		const todoList = await $.getJSON('TodoList.json');
		App.contracts.TodoList = TruffleContract(todoList);
		App.contracts.TodoList.setProvider(App.web3Provider);

		// Hydrate the smart contract with values from the blockchain
		App.todoList = await App.contracts.TodoList.deployed();
	},

	render: async () => {
		if (App.loading) {
			return;
		}
		App.setLoading(true);
		$('#account').html(App.account);
		await App.renderTask();
		App.setLoading(false);
	},
	renderTask: async () => {
		const taskCount = await App.todoList.taskCount();
		const $taskTemplate = $('.taskTemplate');
		console.log(taskCount.toNumber());
		for (var i = 1; i <= taskCount; i++) {
			// console.log('hell is real');
			const task = await App.todoList.tasks(i);
			console.log(task);
			const taskId = task[0].toNumber();
			const taskContent = task[1];
			const taskCompleted = task[2];

			var $newTaskTemplate = $taskTemplate.clone();
			$newTaskTemplate.find('.content').html(taskContent);
			$newTaskTemplate
				.find('.input')
				.prop('name', taskId)
				.prop('checked', taskCompleted)
				.on('click', App.toggleCompletd);

			if (taskCompleted) {
				$('$completedTaskList').append($newTaskTemplate);
			} else {
				$('#taskList').append($newTaskTemplate);
			}
			$newTaskTemplate.show();
		}
	},
	setLoading: async boolean => {
		App.loading = boolean;
		const loader = $('#loader');
		const content = $('#content');

		if (boolean) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});
