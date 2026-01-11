import { getCachedGlobal } from "@/lib/payload";
import type { Nav as NavType } from "@/types/payload-types";
import NavClient from "./NavClient";

const Nav = async () => {
  let navData: NavType | null = null;

  try {
    navData = await getCachedGlobal<NavType>("nav", { depth: 2 });
  } catch {
    // Silently fail - will use fallback
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex h-[var(--nav-height)] max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavClient data={navData} />
      </div>
    </header>
  );
};

export default Nav;
