import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BottomBtn = ({ text = "新建", colorClass, icon, onClick }) => (
  <button
    type="button"
    className={`btn btn-block no-border ${colorClass} w-100 h-100`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} size="lg" />
    {text}
  </button>
);

export default BottomBtn;
