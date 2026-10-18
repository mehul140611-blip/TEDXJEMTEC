export default function Container({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={`container-site ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
