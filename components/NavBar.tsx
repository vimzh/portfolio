import { Nav } from "@/components/Nav";
import { ThemeToggle } from "@/components/ThemeToggle";

export const NavBar = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <Nav />
      <ThemeToggle />
    </div>
  );
};
