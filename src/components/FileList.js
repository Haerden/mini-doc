import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import useKeyPress from "../hooks/useKeyPress";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editSatus, setEditStatus] = useState(false);
  const [value, setValue] = useState('');
  // enter
  const enterPressed = useKeyPress(13);
  // esc
  const escPressed = useKeyPress(27);

  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue("");
    // if we editing a new file we should Del file
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };

  useEffect(() => {
    const editItem = files.find((item) => item.id === editSatus);

    if (enterPressed && editSatus && value.trim() !== '') {
      onSaveEdit(editItem.id, value);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editSatus) {
      closeSearch(editItem);
    }
    // eslint-disable-next-line
  }, [enterPressed, escPressed, value, editSatus, files]);

  // 设置正在编辑的ID 为newfile
  useEffect(()=> {
    const newFile = files.find(file => file.isNew);

    if(newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);

  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => (
        <li
          className="list-group-item bg-light row d-flex align-items-center m-0 file-item"
          key={file.id}
        >
          {(file.id !== editSatus && file.isNew !== true) ? (
            <>
              <span className="col-2">
                <FontAwesomeIcon icon={faMarkdown} size="lg" />
              </span>
              <span
                className="col-7 c-link"
                onClick={() => onFileClick(file.id)}
              >
                {file.title}
              </span>
              <button
                type="button"
                className="icon-button col-1"
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
              >
                <FontAwesomeIcon title="编辑" icon={faEdit} size="lg" />
              </button>
              <button
                type="button"
                className="icon-button col-1"
                onClick={() => onFileDelete(file.id)}
              >
                <FontAwesomeIcon title="删除" icon={faTrash} size="lg" />
              </button>
            </>
          ) : (
            <>
              <input
                className="col-10"
                value={value} 
                placeholder="请输入文件名称"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              ></input>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => closeSearch(file)}
              >
                <FontAwesomeIcon title="关闭" icon={faTimes} size="lg" />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FileList;
