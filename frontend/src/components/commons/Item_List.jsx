export const Item_List = ({ items = [], renderItem, className = "" }) => {
    return (
        <div
            className={`
        flex flex-col gap-8 items-center
        w-full h-[90%]
        hide-scrollbar overflow-y-auto px-2 pb-[20rem]
        cursor-grab touch-pan-x touch-pan-y select-none ${className}
      `}
            style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-x pan-y",
            }}
        >
            {items.map((item) => renderItem(item))}
        </div>
    );
};
