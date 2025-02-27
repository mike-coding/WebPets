
function Button ({ name, onClick })
{
    return (
        <div 
        onClick = {onClick}
        className="flex flex-row font-m6x11 text-4xl text-white bg-gray-900/30 shadow-xl rounded-sm justify-center px-5 tracking-wide pb-1 pt-2.5 transform transition duration-200 hover:scale-110 hover:cursor-default select-none">
        {name}
    </div>
    );
}

export default Button