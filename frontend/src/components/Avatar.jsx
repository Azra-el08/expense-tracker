import { getInitials } from "../utils/profile";

function Avatar({ name, color, size = 38 }) {
  return (
    <span
      className="avatar"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
