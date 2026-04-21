import React from 'react';
import RecommendedSection from '../../components/HomePage/RecommendedSection';
import CategoriesSection from '../../components/HomePage/CategoriesSection';

export default function HomePage() {
  return (
    <div className="px-6 lg:px-12 2xl:px-24">
      <RecommendedSection />
      <CategoriesSection />
    </div>
  );
}
