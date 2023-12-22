import Box from '@src/app/theme/components/Box/Box';
import Button from '@src/app/theme/components/Button/Button';
import Image from '@src/app/theme/components/Image/Image';
import React, { useState } from 'react';

export const Gallery = ({ dataBuffet, isMobile }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigate = (direction) => {
    if (selectedImageIndex !== null) {
      const galleryImages = dataBuffet?.galerias
        ?.filter((image) => image?.arquivo?.tipo === 'galeria');

      const newIndex =
        (selectedImageIndex + direction + galleryImages.length) %
        galleryImages.length;
      setSelectedImageIndex(newIndex);
    }
  };

  const galleryImages = dataBuffet?.galerias
    ?.filter((image) => image?.arquivo?.tipo === 'galeria');

  return (
    <Box>
      <Box
        tag="footer"
        styleSheet={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '.5rem',
          flexDirection: isMobile ? 'column' : 'row',
          height: 'auto',
          width: '100%',
          color: 'your-text-color',
          textAlign: 'left',
          justifyContent: 'left',
          marginTop: '1rem',
        }}
      >
        {galleryImages?.map((image, index) => (
          <Box
            key={index}
            styleSheet={{
              width: isMobile ? '100%' : '20%',
              cursor: 'pointer',
            }}
            onClick={() => openImageModal(index)}
          >
            <Image
              src={`https://buscabuffet.com.br/api/uploads/${image?.arquivo?.nome}`}
              alt="image"
              styleSheet={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            />
          </Box>
        ))}
      </Box>

      {selectedImageIndex !== null && (
        <Box
          styleSheet={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Button
            styleSheet={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '16px',
            }}
            onClick={closeImageModal}
          >
            X
          </Button>
          <Button
            styleSheet={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: '20px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onClick={() => navigate(-1)}
            colorVariant='secondary'
          >
            &lt;
          </Button>
          <Button
            styleSheet={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '20px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '16px',
            }}
            colorVariant='secondary'
            onClick={() => navigate(1)}
          >
            &gt;
          </Button>
          <Image
            src={`https://buscabuffet.com.br/api/uploads/${galleryImages[selectedImageIndex]?.arquivo?.nome}`}
            alt="image"
            styleSheet={{
              maxWidth: '90%',
              maxHeight: '90%',
            }}
          />
        </Box>
      )}
    </Box>
  );
};
