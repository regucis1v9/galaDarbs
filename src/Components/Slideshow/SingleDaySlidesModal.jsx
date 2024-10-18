import { Image, Card, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import classes from '../../style/CardCarousel.module.css';
import '@mantine/carousel/styles.css';

export default function SingleDaySlidesModal({ slides }) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  const slidesToDisplay = slides.map((slide) => (
    <Carousel.Slide key={slide.id}>
      <Image src={slide.imageLink} height={220} style={{ objectFit: 'cover' }} />
      <div
        className={slide.textPosition} // Directly use the textPosition class name
        style={{
          color: slide.textColor,
          backgroundColor: slide.bgColor,
          padding:"10px",
          position: 'absolute', // Positioning to allow placement on the image
          textAlign: 'center', // Center text by default
          width: 'calc(100% - 10px)', // Full width minus padding
        }}
      >
        <Text>{slide.description}</Text> {/* Display the description */}
      </div>
    </Carousel.Slide>
  ));

  return (
    <Card radius="md" withBorder padding="xl">
      <Card.Section>
        <Carousel
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          withIndicators
          loop
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slidesToDisplay}
        </Carousel>
      </Card.Section>
    </Card>
  );
}
