import { ReactNode, createContext, useContext, useState } from "react";
import { SpeciesContent } from "../types/species"

const defaultContent: SpeciesContent = {
    commonName: "common",
    scientificName: "scientific",
    introduction: "introduction",
    images: [],
    location: "Unknown",
}

const InfoPopupContext = createContext({ speciesContent: defaultContent, setSpeciesContent: (content: SpeciesContent) => console.log("Not working :("), isOpen: false, setOpen: () => console.log("Not working :("), setClose: () => console.log("Not working :(") })

export const InfoPopupProvider = (props: { children: ReactNode }) => {
    const [speciesContent, setSpeciesContent] = useState(defaultContent)
    const [isOpen, setIsOpen] = useState(true);
    const setOpen = () => setIsOpen(true)
    const setClose = () => setIsOpen(false)

    return (
        <InfoPopupContext.Provider value={{ speciesContent, setSpeciesContent, isOpen, setOpen, setClose }}>
            {props.children}
        </InfoPopupContext.Provider>)
}

export const useInfoPopup = () => useContext(InfoPopupContext)