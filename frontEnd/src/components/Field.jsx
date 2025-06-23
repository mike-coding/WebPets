import { useState } from "react";

function Field({ title, value, setValue, hide = false }) {
    return (
      <div className="FIELD___ flex flex-col sm:flex-row w-full sm:w-3/4 lg:w-1/2 max-w-md items-stretch sm:items-center font-m6x11 text-2xl sm:text-3xl lg:text-4xl text-white bg-gray-900/30 shadow-md rounded-sm justify-start tracking-wide">
        <div className="TITLE___ bg-gray-900/30 flex flex-row rounded-t-md sm:rounded-l-md sm:rounded-t-none items-center px-3 sm:px-4 pt-2 sm:pt-2.5 pb-1 hover:cursor-default select-none">
          {title}:
        </div>
        <input
          type={hide ? "password" : "text"}
          className={`ENTRY___ flex flex-row pl-3 items-center pt-2 sm:pt-2.5 pb-1 bg-transparent outline-none font-m6x11 w-full min-w-0 ${hide ? "input-password" : ""}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={10} // Limit to 10 characters
        />
      </div>
    );
}
  
export default Field;

