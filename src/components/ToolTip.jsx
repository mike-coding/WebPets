function Tooltip({ text }) {
  return (
    <div className="absolute top-full h-[5vh] mt-3 pt-1 px-5 bg-gray-900/30 shadow-md rounded-sm flex justify-center items-center font-m6x11 text-3xl text-white tracking-wide">
      {text}
    </div>
  );
}

export default Tooltip;
