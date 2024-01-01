import clsx from "clsx";

export default function Button({ children, className, ...rest }) {
    return (
        <button
            {...rest}
            className={clsx(
                "p-3 w-max bg-green-400/75 rounded-md hover:bg-green-400/50 transition-all",
                className
            )}
        >
            {children}
        </button>
    );
}
