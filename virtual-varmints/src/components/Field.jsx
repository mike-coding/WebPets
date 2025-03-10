import { useState } from "react";

function Field({ title, value, setValue, hide = false }) {
    return (
      <div className="FIELD___ flex flex-row w-1/4 items-center font-m6x11 text-4xl text-white bg-gray-900/30 shadow-md rounded-sm justify-start tracking-wide">
        <div className="TITLE___ bg-gray-900/30 flex flex-row rounded-l-md items-center px-4 pt-2.5 pb-1 hover:cursor-default select-none">
          {title}:
        </div>
        <input
          type={hide ? "password" : "text"}
          className={`ENTRY___ flex flex-row pl-3 items-center pt-2.5 pb-1 bg-transparent outline-none font-m6x11 ${hide ? "input-password" : ""}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={10} // Limit to 10 characters
        />
      </div>
    );
}
  
export default Field;

