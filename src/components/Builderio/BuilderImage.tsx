'use client';
import Image from 'next/image';

const builderLoader = ({ src, width, height, quality }) => {
  return `${src}?width=${width}&quality=${quality || 100}&height=${height}`;
};

const BuilderImage = (props) => {
  return (
    <Image
      loader={builderLoader}
      alt={props.alt || 'Xflow payments'}
      {...props}
    />
  );
};

export default BuilderImage;
