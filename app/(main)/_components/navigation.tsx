"use client";

import { ChevronsLeft, Plus, Settings, Share2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { type ElementRef, useRef, useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import { Hint } from "@/components/hint";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import { useShare } from "@/hooks/use-share";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { cn } from "@/lib/utils";

import { Navbar } from "./navbar";
import { WorkspaceList } from "./workspace-list";

export const Navigation = () => {
  const pathname = usePathname();
  const params = useParams();
  const settings = useSettings();
  const share = useShare();
  const createWorkspace = useCreateWorkspace();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isMounted, setIsMounted] = useState(false);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    // limit sidebar width between 240px and 480px
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (!sidebarRef.current || !navbarRef.current) return;

    sidebarRef.current.style.width = `${newWidth}px`;
    navbarRef.current.style.setProperty("left", `${newWidth}px`);
    navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (!sidebarRef.current || !navbarRef.current) return;

    setIsCollapsed(false);
    setIsResetting(true);

    sidebarRef.current.style.width = isMobile ? "100%" : "240px";
    navbarRef.current.style.setProperty(
      "width",
      isMobile ? "0" : "calc(100% - 240px)"
    );

    navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    if (!sidebarRef.current || !navbarRef.current) return;

    setIsCollapsed(true);
    setIsResetting(true);

    sidebarRef.current.style.width = "0";
    navbarRef.current.style.setProperty("width", "100%");
    navbarRef.current.style.setProperty("left", "0");

    setTimeout(() => setIsResetting(false), 300);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMobile) collapse();
  }, [pathname, isMobile]);

  if (!isMounted) return null;

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary/30 overflow-y-auto relative flex w-60 flex-col z-10",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <button
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <Hint
            description="Collapse Sidebar"
            side="left"
            sideOffset={5}
            delayDuration={500}
          >
            <ChevronsLeft className="h-6 w-6" />
          </Hint>
        </button>

        <Logo isCollapsed={isCollapsed} />
        <Separator />

        <div className="h-max overflow-hidden overflow-y-auto flex flex-col justify-between p-4 scrollbar">
          <WorkspaceList />
        </div>

        <div className="flex flex-col w-full items-center">
          <Button
            onClick={createWorkspace.onOpen}
            className="w-3/4 m-2.5 max-w-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Workspace
          </Button>

          <Separator />

          <div className="w-full flex items-center justify-center space-x-[15%]">
            <Button
              onClick={settings.onOpen}
              size="icon"
              className="my-4"
              aria-label="My Settings"
            >
              <Hint description="My Settings" sideOffset={12}>
                <Settings className="h-6 w-6" />
              </Hint>
            </Button>

            <Separator orientation="vertical" className="h-full" />

            <Button
              disabled={!params.workspaceId}
              aria-disabled={!params.workspaceId}
              onClick={share.onOpen}
              size="icon"
              className="my-4"
              aria-label="Share Todo list"
            >
              <Hint description="Share Todo list" sideOffset={12}>
                <Share2 className="h-6 w-6" />
              </Hint>
            </Button>
          </div>
        </div>

        {/* adjust sidebar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
          aria-hidden
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 left-60 z-50 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
      </div>
    </>
  );
};