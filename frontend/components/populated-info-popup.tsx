import { useEffect, useState } from "react";
import { apiConfig } from "../api/apiContext";
import { useInfoPopup } from "../contexts/info-popup-context";
import { SpeciesContent } from "../types/species";
import Button from "./button";

const API_BASE_URL = apiConfig;

const PopulatedInfoPopupButton = (props: { speciesId: string }) => {
    const { setSpeciesContent, setOpen } = useInfoPopup();
    const [content, setContent] = useState({} as SpeciesContent)

    // Fetch species data
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${API_BASE_URL}/species/scientific/${props.speciesId}`);
            const value = await response.json();
            console.log(value)
            setContent(value as SpeciesContent);
        };

        fetchData();
    }, [props.speciesId]);

    const updateContent = () => {
        setSpeciesContent(content)
        setOpen()
    }

    return <Button onPress={updateContent} text={content.commonNames ? content.commonNames[0] : "Loading"} />
}

export default PopulatedInfoPopupButton