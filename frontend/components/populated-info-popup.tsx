import { useEffect, useState, ReactElement, cloneElement } from 'react';
import { apiConfig } from '../api/apiContext';
import { useInfoPopup } from '../contexts/info-popup-context';
import { SpeciesContent } from '../types/species';

const API_BASE_URL = apiConfig;

interface PopulatedInfoPopupButtonProps {
  speciesId: string;
  children: ReactElement;
}

const PopulatedInfoPopupButton = ({
  speciesId,
  children,
}: PopulatedInfoPopupButtonProps) => {
  const { setSpeciesContent, setOpen } = useInfoPopup();
  const [content, setContent] = useState({} as SpeciesContent);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/species/scientific/${speciesId}`,
      );
      const value = await response.json();
      setContent(value as SpeciesContent);
    };

    fetchData();
  }, [speciesId]);

  const updateContent = () => {
    setSpeciesContent(content);
    setOpen();
  };

  return cloneElement(children, {
    onPress: updateContent,
    text: content.commonNames ? content.commonNames[0] : 'Loading...',
  });
};

export default PopulatedInfoPopupButton;
