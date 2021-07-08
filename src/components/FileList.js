import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import useKeyPress from "../hooks/useKeyPress";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editSatus, setEditStatus] = useState(false);
  const [value, setValue] = useState(false);
  // enter
  const enterPressed = useKeyPress(13);
  // esc
  const escPressed = useKeyPress(27);

  const closeSearch = () => {
    setEditStatus(false);
    setValue("");
  };

  useEffect(() => {
    if (enterPressed && editSatus) {
      const editItem = files.find((item) => item.id === editSatus);

      onSaveEdit(editItem.id, value);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editSatus) {
      closeSearch();
    }
  }, [enterPressed, escPressed, value, editSatus, files, onSaveEdit]);

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
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              ></input>
              <button
                type="button"
                className="icon-button col-2"
                onClick={closeSearch}
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
