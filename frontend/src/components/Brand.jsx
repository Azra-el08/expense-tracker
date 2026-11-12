import { APP_NAME, APP_TAGLINE } from "../config";

function Brand({ showTagline = true }) {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">₱</span>
      <span className="brand-text">
        <span className="brand-name">{APP_NAME}</span>
        {showTagline && <span className="brand-tag">{APP_TAGLINE}</span>}
      </span>
    </div>
  );
}

export default Brand;
