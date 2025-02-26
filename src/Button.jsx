
function Button ({ name, onClick })
{
    return (
        <div 
        onClick = {onClick}
        className="flex flex-row font-mono text-lg text-black bg-gray-200 rounded-sm shadow-sm justify-center px-5 py-2 transform transition duration-200 hover:scale-110 hover:cursor-default select-none">
        {name}
    </div>
    );
}

export default Button