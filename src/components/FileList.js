import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editSatus, setEditStatus] = useState(false);
  const [value, setValue] = useState(false);

  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => (
        <li
          className="list-group-item bg-light row d-flex align-items-center file-item"
          key={file.id}
        >
          <span className="col-2">
            <FontAwesomeIcon icon={faMarkdown} size="lg" />
          </span>

          <span className="col-7 c-link" onClick={() => onFileClick(file.id)}>
            {file.title}
          </span>

          <button
            type="button"
            className="icon-button col-1"
            onClick={() => {}}
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
        </li>
      ))}
    </ul>
  );
};

export default FileList;
