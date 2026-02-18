"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CommonService } from "@/services/common.service";
import { LayoutViewModel, LoaderInfo } from "@/models/internal/common-models";

const initialLoaderInfo: LoaderInfo = { message: "", showLoader: false };

interface CommonContextType {
  commonService: CommonService;
  layoutViewModel: LayoutViewModel;
  showNav: boolean;
  setShowNav: (show: boolean) => void;
  loaderInfo: LoaderInfo;
}

const CommonContext = createContext<CommonContextType | undefined>(undefined);

const commonService = new CommonService();

export function CommonProvider({ children }: { children: ReactNode }) {
  const [showNav, setShowNav] = useState(true);
  const [loaderInfo, setLoaderInfo] = useState<LoaderInfo>(initialLoaderInfo);

  useEffect(() => {
    commonService.setLoaderInfo = setLoaderInfo;
    return () => {
      commonService.setLoaderInfo = null;
    };
  }, []);

  const value: CommonContextType = {
    commonService,
    layoutViewModel: commonService.layoutViewModel,
    showNav,
    setShowNav,
    loaderInfo,
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
