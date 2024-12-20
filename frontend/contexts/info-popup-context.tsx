import { ReactNode, createContext, useContext, useState } from 'react';
import { SpeciesContent } from '../types/species';

const defaultContent: SpeciesContent = {
  _id: 'default-id',
  visibility: true,
  commonNames: ['common'],
  aphiaId: '0',
  scientificName: 'scientific',
  introduction: 'introduction',
  articleTitle: 'Title',
  articleUrl: 'wwww.wikipedia.org/stuff',
  imageUrls: [],
  iconUrl: 'https://dodo.ac/np/images/0/00/Black_Bass_NH_Icon.png',
  locations: [],
};

const InfoPopupContext = createContext({
  speciesContent: defaultContent,
  setSpeciesContent: (content: SpeciesContent) => console.log('Not working :('),
  isOpen: false,
  setOpen: () => console.log('Not working :('),
  setClose: () => console.log('Not working :('),
});

export const InfoPopupProvider = (props: { children: ReactNode }) => {
  const [speciesContent, setSpeciesContent] = useState(defaultContent);
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = () => setIsOpen(true);
  const setClose = () => setIsOpen(false);

  return (
    <InfoPopupContext.Provider
      value={{ speciesContent, setSpeciesContent, isOpen, setOpen, setClose }}
    >
      {props.children}
    </InfoPopupContext.Provider>
  );
};

export const useInfoPopup = () => useContext(InfoPopupContext);
