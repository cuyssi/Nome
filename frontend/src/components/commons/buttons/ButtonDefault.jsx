import clsx from "clsx";

export const ButtonDefault = ({ type = "button", onClick, className, text, icon, hover }) => {
    const hasBgClass = className && className.includes("bg-");
    const hasTextClass = className && className.includes("text-");
    const baseClasses = "p-2 font-poppins rounded";
    const colorClass = hasBgClass ? "" : "bg-purple-600";
    const textColorClass = hasTextClass ? "" : "text-white";
    
    return (
        <button
            type={type}
            onClick={onClick}
            hover={hover}
            className={clsx(baseClasses, colorClass, textColorClass, className)}
        >
            {icon} {text}
        </button>
    );
};
