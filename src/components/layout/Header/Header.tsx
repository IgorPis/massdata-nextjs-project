import { useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useReactiveVar } from "@apollo/client";

import { cartVar } from "@/state/cart/cartState";
import { useIsMobile } from "@/features/layout/hooks/useIsMobile";
import type { Category } from "@/types/graphql";

import { isVisibleCategory } from "./categoryUtils";
import HeaderTopBar from "./HeaderTopBar/HeaderTopBar";
import HeaderCategoryNav from "./HeaderCategoryNav/HeaderCategoryNav";
import CategoryDrawer from "./CategoryDrawer/CategoryDrawer";
import SearchDrawer from "./SearchDrawer/SearchDrawer";
import MobileFloatingCart from "./MobileFloatingCart/MobileFloatingCart";

export default function Header({ categories }: { categories: Category[] }) {
  const cart = useReactiveVar(cartVar);
  const count = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const isMobile = useIsMobile();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const topCats = useMemo(
    () => (categories ?? []).filter(isVisibleCategory).slice(0, 10),
    [categories]
  );

  const subcats = useMemo(
    () => (activeCategory?.children ?? []).filter(isVisibleCategory),
    [activeCategory]
  );

  const openMainMenu = () => {
    setActiveCategory(null);
    setDrawerOpen(true);
  };

  const openCategory = (cat: Category) => {
    setActiveCategory(cat);
    setDrawerOpen(true);
  };

  return (
    <Box component="header">
      <AppBar position="fixed" elevation={1} sx={{ borderRadius: 0 }}>
        <HeaderTopBar
          isMobile={isMobile}
          cartCount={count}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMenu={openMainMenu}
        />

        {!isMobile && (
          <HeaderCategoryNav topCats={topCats} onOpenCategory={openCategory} />
        )}

        <CategoryDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          topCats={topCats}
          activeCategory={activeCategory}
          onSetActiveCategory={setActiveCategory}
          subcats={subcats}
          onOpenCategory={openCategory}
          isMobile={isMobile}
        />

        <SearchDrawer
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          value={searchValue}
          onChange={setSearchValue}
          onSubmit={() => setSearchOpen(false)}
        />
      </AppBar>

      <Toolbar />
      {!isMobile && <Toolbar sx={{ minHeight: 44 }} />}

      {isMobile && <MobileFloatingCart cartCount={count} />}
    </Box>
  );
}
