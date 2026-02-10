"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext({
    size: "default",
    variant: "default",
});

function ToggleGroup({
    className,
    variant,
    size,
    children,
    ...props
}) {
    return (
        <ToggleGroupPrimitive.Root
            data-slot="toggle-group"
            className={cn("flex items-center justify-center gap-1", className)}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant, size }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
}

function ToggleGroupItem({
    className,
    children,
    variant,
    size,
    ...props
}) {
    const context = React.useContext(ToggleGroupContext);

    return (
        <ToggleGroupPrimitive.Item
            data-slot="toggle-group-item"
            className={cn(
                toggleVariants({
                    variant: context.variant || variant,
                    size: context.size || size,
                }),
                "min-w-0 px-2 shadow-none first:rounded-l-md last:rounded-r-md data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
                className,
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
}

export { ToggleGroup, ToggleGroupItem };
