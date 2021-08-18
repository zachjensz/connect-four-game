import { CSSProperties } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
  style?: CSSProperties
}

export const Page = ({ children, style }: Props) => {
  return <div className="page" style={style}>{children}</div>;
};

export default Page;
