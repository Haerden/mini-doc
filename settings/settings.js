const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const settingsStore = new Store({ name: 'Settings' });

const $ = (selector) => {
  const result = document.querySelectorAll(selector);
  return result.length > 1 ? result : result[0];
}

document.addEventListener('DOMContentLoaded', () => {
  let savedLocation = settingsStore.get('savedFileLocation');

  if (savedLocation) {
    $('#savedFileLocation').value = savedLocation;
  }

  $('#select-new-location').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }).then((filePaths) => {
      if (Array.isArray(filePaths.filePaths)) {
        $('#savedFileLocation').value = filePaths.filePaths[0];

        savedLocation = filePaths.filePaths[0];
      }
    });
  });

  $('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault();

    settingsStore.set('savedFileLocation', savedLocation);
    remote.getCurrentWindow().close()
  });

  $('.nav-tabs').addEventListener('click', (e) => {
    e.preventDefault()
    $('.nav-link').forEach(element => {
      element.classList.remove('active')
    });

    e.target.classList.add('active');

    $('.config-area').forEach(element => {
      element.style.display = 'none'
    });

    $(e.target.dataset.tab).style.display = 'block';
  });
})