import React from 'react';
import { HeroCarousel } from './HeroCarousel';
import { MediaItem } from '../types';

interface HeroSliderProps {
  items: MediaItem[];
  isHomeH1?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ items, isHomeH1 = false }) => {
  return <HeroCarousel items={items} isHomeH1={isHomeH1} />;
};

export default HeroSlider;
