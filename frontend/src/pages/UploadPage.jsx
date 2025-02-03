import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router';

// Fix ikon problémákhoz
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UploadPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    publisherType: 'seller',
    city: '',
    area: '',
    price: '',
    images: [],
    mainImage: 0,
    location: [47.4979, 19.0402] // Budapest default
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setFormData(prev => ({ ...prev, images }));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 4) {
      setStep(stepNumber);
    }
  };


  const setMainImage = (index) => {
    setFormData(prev => ({ ...prev, mainImage: index }));
  };

  const handleMapClick = (e) => {
    setFormData(prev => ({
      ...prev,
      location: [e.latlng.lat, e.latlng.lng]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DataInputStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <ImageUploadStep
          images={formData.images}
          mainImage={formData.mainImage}
          handleImageUpload={handleImageUpload}
          setMainImage={setMainImage}
        />;
      case 3:
        return <MapStep
          location={formData.location}
          handleMapClick={handleMapClick}
        />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">

      <div className="w-full flex flex-row items-center justify-between bg-white px-12 py-4">

        <div>
          <Link to="/">
            <span className=' font-semibold text-gray-500 hover:text-gray-600'>Mégsem</span>
          </Link>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center">
          {[
            { step: 1, title: 'Adatok' },
            { step: 2, title: 'Fájlok' },
            { step: 3, title: 'Helyszín' },
            { step: 4, title: 'Előnézet' }
          ].map(({ step: num, title }, index, arr) => (
            <div key={num} className="flex items-center">
              {/* Step gomb */}
              <button
                onClick={() => goToStep(num)}
                className="flex flex-row items-center gap-3 focus:outline-none"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${step >= num ? 'bg-black text-white' : 'border-2 border-gray-500 border-solid text-gray-500'}`}>
                  {step > num ? <IconCheck size={20} /> : num}
                </div>
                <span className={`text-sm font-semibold ${step === num ? 'text-black' : 'text-gray-500'}`}>
                  {title}
                </span>
              </button>

              {/* Vízszintes vonal a lépések között (kivéve utolsó után) */}
              {index !== arr.length - 1 && (
                <div className="flex-1 flex justify-center mr-3 ml-3">
                  <div className="w-4 h-0.5 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className='flex gap-2'>
          <button
            onClick={prevStep}
            disabled={step > 1 ? false : true}
            className='border-2 border-gray-500 text-gray-500 px-2.5 py-2 text-sm font-semibold rounded-md enabled:hover:border-black enabled:hover:text-black focus:outline-none'
          >
            Vissza
          </button>
          {step < 4 ? (
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white text-sm font-semibold px-2.5 py-2 rounded-md enabled:hover:bg-blue-600 focus:outline-none"
            >
              Következő
            </button>
          ) : (
            <button
              onClick={() => console.log('Submit:', formData)}
              className="bg-green-500 text-white text-sm font-semibold px-2.5 py-2 rounded-md enabled:hover:bg-green-600 focus:outline-none"
            >
              Közzététel
            </button>
          )}
        </div>
      </div>


      <div className='max-w-4xl mx-auto p-4'>
        {renderStep()}
      </div>
    </div>
  );
};

// Step Components
const DataInputStep = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <select
      value={formData.publisherType}
      onChange={(e) => setFormData(prev => ({ ...prev, publisherType: e.target.value }))}
      className="w-full p-2 border rounded"
    >
      <option value="seller">Eladó</option>
      <option value="agency">Ingatlanos</option>
    </select>

    <input
      type="text"
      placeholder="Város"
      value={formData.city}
      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
      className="w-full p-2 border rounded"
    />

    <input
      type="number"
      placeholder="Négyzetméter"
      value={formData.area}
      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
      className="w-full p-2 border rounded"
    />

    <input
      type="number"
      placeholder="Ár (Ft)"
      value={formData.price}
      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
      className="w-full p-2 border rounded"
    />
  </div>
);

const ImageUploadStep = ({ images, mainImage, handleImageUpload, setMainImage }) => (
  <div>
    <input
      type="file"
      multiple
      onChange={handleImageUpload}
      className="mb-4"
    />

    <div className="grid grid-cols-3 gap-4">
      {images.map((img, index) => (
        <div
          key={img.name}
          onClick={() => setMainImage(index)}
          className={`cursor-pointer border-2 ${index === mainImage ? 'border-blue-500' : ''}`}
        >
          <img src={img.url} alt={img.name} className="w-full h-32 object-cover" />
        </div>
      ))}
    </div>
  </div>
);

const MapStep = ({ location, handleMapClick }) => (
  <div className="h-96">
    <MapContainer
      center={location}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      onClick={handleMapClick}
    >
      <TileLayer
        url={process.env.REACT_APP_MAPBOX_URL}
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©
                      <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
                      <strong>
                      <a href="https://labs.mapbox.com/contribute/" target="_blank">
                      Improve this map
                      </a>
                      </strong>'
      />
      <Marker position={location} />
    </MapContainer>
  </div>
);

const ReviewStep = ({ formData }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Összegzés</h2>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-bold">Alapadatok</h3>
        <p>Típus: {formData.publisherType === 'seller' ? 'Eladó' : 'Ingatlanos'}</p>
        <p>Város: {formData.city}</p>
        <p>Terület: {formData.area} m²</p>
        <p>Ár: {formData.price} Ft</p>
      </div>

      <div>
        <h3 className="font-bold">Főkép</h3>
        {formData.images[formData.mainImage] && (
          <img
            src={formData.images[formData.mainImage].url}
            alt="Main"
            className="w-full h-32 object-cover"
          />
        )}
        <p>Képek száma: {formData.images.length}</p>
      </div>
    </div>

    <div className="h-64">
      <MapContainer
        center={formData.location}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        zoomControl={false}
      >
        <TileLayer
          url={process.env.REACT_APP_MAPBOX_URL}
          attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©
                      <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
                      <strong>
                      <a href="https://labs.mapbox.com/contribute/" target="_blank">
                      Improve this map
                      </a>
                      </strong>'
        />
        <Marker position={formData.location} />
      </MapContainer>
    </div>
  </div>
);

export default UploadPage;