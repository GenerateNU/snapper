import { ReactNode, createContext, useContext, useState } from "react";

const InfoPopupContext = createContext({ isOpen: false, setOpen: () => console.log("Not working :("), setClose: () => console.log("Not working :(") })

export const InfoPopupProvider = (props: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const setOpen = () => setIsOpen(true)
    const setClose = () => setIsOpen(false)

    return (
        <InfoPopupContext.Provider value={{ isOpen, setOpen, setClose }}>
            {props.children}
        </InfoPopupContext.Provider>)
}

export const useInfoPopup = () => useContext(InfoPopupContext)