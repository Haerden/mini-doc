const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const settingsStore = new Store({ name: 'Settings' });
const qiniuConfigArr = ['#savedFileLocation', '#accessKey', '#secretKey', '#bucketName'];

const $ = (selector) => {
	const result = document.querySelectorAll(selector);
	return result.length > 1 ? result : result[0];
}

document.addEventListener('DOMContentLoaded', () => {
	// get the saved config and fill in the input
	qiniuConfigArr.forEach(selector => {
		const savedValue = settingsStore.get(selector.substring(1));

		if (savedValue) {
			$(selector).value = savedValue;
		}
	})
	$('#select-new-location').addEventListener('click', () => {
		remote.dialog.showOpenDialog({
			properties: ['openDirectory'],
			message: '选择文件的存储路径',
		}).then((filePaths) => {
			if (Array.isArray(filePaths.filePaths)) {
				$('#savedFileLocation').value = filePaths.filePaths[0];
			}
		});
	});

	// 存储路径
	$('#settings-form').addEventListener('submit', (e) => {
		e.preventDefault();

		qiniuConfigArr.forEach(selector => {
			if ($(selector)) {
				let { id, value } = $(selector);

				settingsStore.set(id, value ? value : '');
			}
		});

		// sent a event to main process to enable menu items if qiniu is saved
		ipcRenderer.send('config-is-saved');

		remote.getCurrentWindow().close()
	});

	// tabs 点击
	$('.nav-tabs').addEventListener('click', (e) => {
		e.preventDefault();

		$('.nav-link').forEach(element => {
			element.classList.remove('active');
		});

		e.target.classList.add('active');

		$('.config-area').forEach(element => {
			element.style.display = 'none'
		});

		$(e.target.dataset.tab).style.display = 'block';
	});
})