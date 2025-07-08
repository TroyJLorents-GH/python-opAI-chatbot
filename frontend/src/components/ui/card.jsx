export function Card({ children, className, ...rest }) {
  return <div className={className} {...rest}>{children}</div>;
}
export function CardContent({ children, className, ...rest }) {
  return <div className={className} {...rest}>{children}</div>;
}
