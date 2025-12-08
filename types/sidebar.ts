import { ReactElement } from "react";

export type SubMenuItem = {
  id: number;
    icon:  any;
    title: string;
    pathname?: string;
    subMenu?: SubMenuItem[];
  };
  
  export type MenuItem = {
    id: number;
    icon:  any;
    title: string;
    subMenu?: SubMenuItem[];
    pathname?: string;
  };
  
  export type ModuleItem = {
    id: number;
    name: string;
    icon: any;
    Menu: MenuItem[];
    admin: boolean;
  };
  