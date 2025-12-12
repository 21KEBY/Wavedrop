import { useContext } from 'react';
import { LecteurContext } from '../context/LecteurContext';

export const useAudio = () => {
  const context = useContext(LecteurContext);
  
  if (!context) {
    throw new Error('useAudio doit être utilisé à l\'intérieur d\'un LecteurProvider');
  }
  
  return context;
};