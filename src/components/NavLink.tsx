import { Link } from "@tanstack/react-router";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn(className)}
      activeProps={{ className: cn(activeClassName) }}
      {...props}
    />
  ),
);

NavLink.displayName = "NavLink";
