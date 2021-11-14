import { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 } from "uuid";
import { flattenArr, objToArr, timestampToString } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TabList from "./components/TabList";
import useIpcRenderer from './hooks/useIpcRenderer'
const { join, basename, extname, dirname } = window.require("path");
const { remote, ipcRenderer } = window.require("electron");
const Store = window.require("electron-store");

const fileStore = new Store({ name: "Files Data" });
const settingsStore = new Store({ name: 'Settings' });
const getAutoSync = () => ['accessKey', 'secretKey', 'bucketName', 'enableAutoSync'].every(key => !!settingsStore.get(key));

const saveFilesToStore = (files) => {
  // dont have to save all info
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    // 过滤file 信息
    const { id, path, title, createdAt, isSynced, updatedAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt,
      isSynced,
      updatedAt
    };

    return result;
  }, {});

  fileStore.set("files", fileStoreObj);
};

function App() {
  const [files, setFiles] = useState(fileStore.get("files") || {});
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFileIds] = useState([]);
  const [unsavedFileIDs, setUnSavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files);
  const saveLoacation = settingsStore.get('savedFileLocation') || remote.app.getPath('documents');
  const openedFiles = openedFileIDs.map((openID) => files[openID]);
  const activeFile = files[activeFileID];
  const fileListArr = searchedFiles.length ? searchedFiles : filesArr;

  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter((file) => file.title.includes(keyword));

    setSearchedFiles(newFiles);
  };

  // fileClick
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper
        .readFile(currentFile.path)
        .then((value) => {
          const newFile = {
            ...files[fileID],
            body: value,
            isLoaded: true,
          };
          setFiles({ ...files, [fileID]: newFile });
        })
        .catch(() => {
          // TODO 文件已不存在
        });
    }
    // openedFileIDs dont have fileID add
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIds([...openedFileIDs, fileID]);
    }
  };

  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };

  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter((fileID) => id !== fileID);

    setOpenedFileIds(tabsWithout);

    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID("");
    }
  };

  const fileChange = (id, value) => {
    const newFiles = changeFile(id, "body", value);

    setFiles(newFiles);
    // update unsavedIDs
    if (!unsavedFileIDs.includes(id)) {
      setUnSavedFileIDs([...unsavedFileIDs, id]);
    }
  };

  // 修改指定id 的 文件的 [key, value], 并更新path
  const changeFile = (id, key, value, newPath) => {
    const newFiles = { ...files };
    newFiles[id][key] = value;
    newFiles[id].isNew = false;
    newPath && (newFiles[id].path = newPath);

    return newFiles;
  };

  // 新建或者修改文件
  const updateFileName = (id, value, isNew) => {
    const oldPath = files[id].path;
    const newPath = isNew ? join(saveLoacation, `${value}.md`) : join(dirname(files[id].path), `${value}.md`);
    const newFiles = changeFile(id, "title", value, newPath);

    if (isNew) {
      fileHelper.writeFile(newPath, newFiles[id].body).then(() => {
        setFiles(newFiles);
        // 持久化
        saveFilesToStore(newFiles);
      });
    } else {
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
        // 持久化
        saveFilesToStore(newFiles);
      });
    }
  };

  const saveCurrentfile = () => {
    const { path, body, title } = activeFile;

    fileHelper
      .writeFile(path, body)
      .then(() => {
        setUnSavedFileIDs(unsavedFileIDs.filter((id) => id !== activeFileID));

        if(getAutoSync()) {
          ipcRenderer.send('upload-file', {
            key: `${title}.md`,
            path
          });
        }
      });
  };

  // 删除文件
  const deleteFile = (id) => {
    if (files[id].isNew) {
      // const newFiles = { ...files };
      // delete newFiles[id];
      // spread 语法
      const { [id]: value, ...afterDeleteFiles } = files;
      setFiles(afterDeleteFiles);

      return;
    }

    fileHelper
      .deleteFile(files[id].path)
      .then(() => {
        const { [id]: value, ...afterDeleteFiles } = files;
        tabClose(id);
        setFiles(afterDeleteFiles);
        saveFilesToStore(afterDeleteFiles);
      })
      .catch(() => {
        const { [id]: value, ...afterDeleteFiles } = files;
        tabClose(id);
        setFiles(afterDeleteFiles);
        saveFilesToStore(afterDeleteFiles);
      });
  };

  const createNewFile = () => {
    const newID = v4();
    const newFiles = {
      ...files,
      [newID]: {
        id: newID,
        title: "",
        body: "## please input",
        createdAt: new Date().getTime(),
        isNew: true,
      },
    };

    setFiles(newFiles);
  };

  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的 MarkDown 文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Markdown Files', extensions: ['md'] }
      ]
    }).then(({ filePaths }) => {
      if (Array.isArray(filePaths)) {
        // 防止重复插入-过滤
        const filterPaths = filePaths.filter(filePath => {
          const alreadyAdded = Object.values(files).find(file => file.path === filePath);

          return !alreadyAdded;
        });

        // 扩展数组
        const importFiles = filterPaths.map((path) => {
          return {
            id: v4(),
            title: basename(path, extname(path)),
            path
          }
        });

        // 合并新老文件，Array to Obj
        const newFiles = {
          ...files,
          ...flattenArr(importFiles)
        };

        // setFiles and update store
        setFiles(newFiles);
        saveFilesToStore(newFiles);

        if (importFiles.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            message: `成功导入了${importFiles.length}个文件。`
          })
        }
      }
    })
  };

  const activeFileUploaded = () => {
    const { id } = activeFile;
    const modifiedFile = {
      ...files[id], isSynced: true, updatedAt: new Date().getTime()
    }; 
    const newFiles = { ...files, [id]: modifiedFile };
    debugger;
    setFiles(newFiles);
    saveFilesToStore(newFiles);
  };

  useIpcRenderer({
    'create-new-file': createNewFile,
    'import-file': importFiles,
    'save-edit-file': saveCurrentfile,
    'active-file-uploaded': activeFileUploaded
  });

  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-4 left-panel">
          <FileSearch title="我的策略" onFileSearch={fileSearch} />

          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />

          <div className="row g-0 button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="Import"
                colorClass="btn-success"
                icon={faFileImport}
                onClick={importFiles}
              />
            </div>
          </div>
        </div>
        <div className="col-8 right-panel">
          {!activeFileID ? (
            <div className="start-page">choose or create file</div>
          ) : (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onTabClose={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => fileChange(activeFile.id, value)}
              />
              {
                activeFile.isSynced && 
                <span className="sync-status">已同步，上次同步{timestampToString(activeFile.updatedAt)}</span>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
