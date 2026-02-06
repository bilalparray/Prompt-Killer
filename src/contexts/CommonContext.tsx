"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CommonService } from "@/services/common.service";
import { LayoutViewModel } from "@/models/internal/common-models";

interface CommonContextType {
  commonService: CommonService;
  layoutViewModel: LayoutViewModel;
  showNav: boolean;
  setShowNav: (show: boolean) => void;
}

const CommonContext = createContext<CommonContextType | undefined>(undefined);

const commonService = new CommonService();

export function CommonProvider({ children }: { children: ReactNode }) {
  const [showNav, setShowNav] = useState(true);

  const value: CommonContextType = {
    commonService,
    layoutViewModel: commonService.layoutViewModel,
    showNav,
    setShowNav,
  };

  return <CommonContext.Provider value={value}>{children}</CommonContext.Provider>;
}

export function useCommon() {
  const context = useContext(CommonContext);
  if (context === undefined) {
    throw new Error("useCommon must be used within a CommonProvider");
  }
  return context;
}
