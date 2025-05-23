import clsx from "clsx";
import { CurrentCartIcon as CurrentCartIconPrimitive, CurrentCartModalClose as CurrentCartModalClosePrimitive, CurrentCartModal as CurrentCartModalPrimitive } from "../headless/CurrentCart/CurrentCart";
import ShoppingCartIcon from "./ShoppingCartIcon";
import XMarkIcon from "./XMarkIcon";

export const CurrentCartIcon = (props: Omit<React.ComponentProps<typeof CurrentCartIconPrimitive>, 'children'>) => (
    <CurrentCartIconPrimitive {...props}>
        {({ cartCount, open }) => (
            <button aria-label="Open cart" onClick={open}>
                <span className="sr-only">Open cart</span>
                <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                >
                    <ShoppingCartIcon
                        className="h-4 transition-all ease-in-out hover:scale-110"
                    />

                    {
                        cartCount ? (
                            <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                                {cartCount}
                            </div>
                        ) : null
                    }
                </div>
            </button>
        )}
    </CurrentCartIconPrimitive>
)

export const CurrentCartModal = (props: Omit<React.ComponentProps<typeof CurrentCartModalPrimitive>, 'children'> & { children?: React.ReactNode }) => (
    <CurrentCartModalPrimitive {...props}>
        {({ isOpen, close }) => (
            <div className="relative z-50">
                <label
                    onClick={close}
                    className={clsx("fixed inset-0 bg-black/30 transition-all ease-in-out duration-300", {
                        "opacity-100 backdrop-blur-[.5px] block": isOpen,
                        "opacity-0 backdrop-blur-none hidden": !isOpen
                    })}
                    aria-hidden="true"
                >
                </label>
                <div
                    className={clsx("fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white transition-all ease-in-out duration-300", {
                        "translate-x-0": isOpen,
                        "translate-x-full": !isOpen
                    })}
                >
                    {props.children}
                </div>
            </div>
        )}
    </CurrentCartModalPrimitive>
)

export const CurrentCartModalClose = (props: Omit<React.ComponentProps<typeof CurrentCartModalClosePrimitive>, 'children'> & { children?: React.ReactNode }) => (
    <CurrentCartModalClosePrimitive {...props}>
        {({ close }) => (
            <button aria-label="Close cart" onClick={close}>
                <span className="sr-only">Close cart</span>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
                    <XMarkIcon
                        className={clsx(
                            "h-6 transition-all ease-in-out hover:scale-110",
                        )}
                    />
                </div>
            </button>
        )}
    </CurrentCartModalClosePrimitive>
)