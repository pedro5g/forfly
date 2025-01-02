import { Link, LinkProps, useLocation } from "react-router-dom";

export type NavLinkProps = LinkProps;

export const NavLink = (props: NavLinkProps) => {
  const { pathname } = useLocation();

  const isSelected = props.to === pathname;

  return (
    <Link
      data-selected={isSelected}
      className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground data-[selected=true]:text-foreground"
      {...props}
    />
  );
};
