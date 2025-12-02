"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const DrawerContext = React.createContext<{ modal: boolean }>({ modal: true })

const Drawer = ({
  shouldScaleBackground = true,
  modal = true,
  onOpenChange,
  children,
  open,
  id,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  modal?: boolean
  id?: string
}) => {
  return (
    <DrawerContext.Provider value={{ modal }}>
      <DrawerPrimitive.Root
        shouldScaleBackground={shouldScaleBackground}
        modal={modal}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  )
}

Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const overlayClassName = (extraClassName?: string) =>
  cn("fixed inset-0 z-50 bg-black/80", extraClassName)

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    {...props}
    ref={ref}
    className={overlayClassName(className)}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { modal: isModal } = React.useContext(DrawerContext)

  return (
    <DrawerPortal>
      {isModal ? (
        <DrawerOverlay />
      ) : (
        <DrawerClose asChild>
          <div
            className={overlayClassName()}
            style={{ pointerEvents: "auto" }}
          />
        </DrawerClose>
      )}
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 outline-none bottom-safe-bottom z-51 mt-24 flex h-auto flex-col rounded-t-3xl border-t bg-background",
          className
        )}
        {...props}
      >
        <div className="mt-3" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-black leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
