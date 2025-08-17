import { Children } from "react";

export default function Field({ label, children, htmlFor, error }) {
  const id = htmlFor || getChildId(children);
  return (
    <div className="form-control">
      {label && (
        <label className="auth-label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {!!error && (
        <div className="text-red-600" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
}

const getChildId = (children) => {
  const child = Children.only(children);
  if (child && "id" in child.props) {
    return child.props.id;
  }
};
