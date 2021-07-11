import { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 } from 'uuid';
import { flattenArr, objToArr } from './utils/helper';
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TabList from './components/TabList';
// import Charts from './components/Charts';
import defaultFiles from "./utils/defaultFiles";
const fs = window.require('fs');
console.dir(fs);

function App() {
  const [files, setFiles] = useState(flattenArr(defaultFiles));
  const [activeFileID, setActiveFileID] = useState('');
  const [openedFileIDs, setOpenedFileIds] = useState([]);
  const [unsavedFileIDs, setUnSavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files);

  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword));

    setSearchedFiles(newFiles);
  };
  // fileClick
  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    // openedFileIDs dont have fileID add
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIds([...openedFileIDs, fileID]);
    }
  };

  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };

  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter(fileID => id !== fileID);

    setOpenedFileIds(tabsWithout);

    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID('');
    }
  };

  // title or body
  const changeFile = (id, key, value) => {
    const newFiles = { ...files };
    newFiles[id][key] = value;
    newFiles[id].isNew = false;

    return newFiles;
  };

  const fileChange = (id, value) => {
    const newFiles = changeFile(id, 'body', value);

    setFiles(newFiles);
    // update unsavedIDs
    if (!unsavedFileIDs.includes(id)) {
      setUnSavedFileIDs([...unsavedFileIDs, id]);
    }
  };

  const updateFileName = (id, value) => {
    const newFiles = changeFile(id, 'title', value);

    setFiles(newFiles);
  };

  const deleteFile = (id) => {
    const newFiles = { ...files };
    delete newFiles[id];

    setFiles(newFiles);
    tabClose(id);
  };

  const createNewFile = () => {
    const newID = v4();
    const newFiles = {
      ...files,
      [newID]: {
        id: newID,
        title: '',
        body: '## please input',
        createdAt: new Date().getTime(),
        isNew: true
      }
    };

    setFiles(newFiles);
  };

  const openedFiles = openedFileIDs.map(openID => files[openID]);

  const activeFile = files[activeFileID];
  const fileListArr = (searchedFiles.length ? searchedFiles : filesArr);

  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-4 left-panel">
          <FileSearch
            title="我的策略"
            onFileSearch={fileSearch}
          />
          {/* <Charts /> */}
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
                onClick={() => { }}
              />
            </div>
          </div>
        </div>
        <div className="col-8 right-panel">
          {!activeFileID ? (
            <div className="start-page">
              choose or create file
            </div>
          ) : (
            <>
              <TabList files={openedFiles}
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
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
