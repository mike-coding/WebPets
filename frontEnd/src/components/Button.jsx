function Button ({ name, onClick })
{
    return (
        <div 
        onClick = {onClick}
        className="w-full sm:w-auto min-w-[120px] h-[6vh] min-h-[48px] pt-1.5 flex flex-row font-m6x11 text-2xl sm:text-3xl lg:text-4xl text-white bg-gray-900/30 shadow-md rounded-sm justify-center items-center px-4 sm:px-5 
        tracking-wide transform transition duration-200 hover:scale-110 hover:cursor-default hover:bg-gray-900/50 select-none active:scale-100">
        {name}
    </div>
    );
}

export default Button