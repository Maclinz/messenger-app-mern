import { useEffect } from "react";

const useDetectOutsideClick = (ref: any, toggleElem: any) => {
  useEffect(() => {
    // check if the element is clicked outside
    const onClick = (e: any) => {
      if (ref.current !== null && !ref.current.contains(e.target)) {
        toggleElem(false); // Directly set to false
      }
    };

    window.addEventListener("mousedown", onClick);

    // Cleanup the event listener

    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, [ref, toggleElem]);

  return [toggleElem, ref];
};

export default useDetectOutsideClick;
