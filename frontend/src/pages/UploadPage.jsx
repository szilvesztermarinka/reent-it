import React, { useState, useContext } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IconCheck } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { appAPI } from "../services/api";

// Ikon konfiguráció
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const UploadPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: "House",
    listtype: "Rent",
    price: "",
    deposit: "",
    description: "",
    bedroom: 1,
    livingroom: 1,
    balcony: "",
    city: "",
    country: "Magyarország",
    county: "",
    yard: "Garden",
    landArea: "",
    built: "",
    images: [],
    mainImage: 0,
    location: [47.4979, 19.0402], // Budapest
  });

  // Validációs szabályok
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.propertyType) newErrors.propertyType = "Kötelező mező";
      if (!formData.listtype) newErrors.listtype = "Kötelező mező";
      if (!formData.price || formData.price < 0) newErrors.price = "Érvénytelen ár";
      if (!formData.deposit || formData.deposit < 0) newErrors.deposit = "Érvénytelen kaució";
      if (!formData.description?.trim()) newErrors.description = "Kötelező mező";
      if (!formData.city?.trim()) newErrors.city = "Kötelező mező";
      if (!formData.county?.trim()) newErrors.county = "Kötelező mező";
      if (!formData.yard) newErrors.yard = "Kötelező mező";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleImageUpload = (files) => {
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10),
    }));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 4) {
      setStep(stepNumber);
    }
  };

  const setMainImage = (index) => {
    setFormData((prev) => ({ ...prev, mainImage: index }));
  };

  const handleMapClick = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: [e.latlng.lat, e.latlng.lng],
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    // Szöveges adatok hozzáadása
    const listingData = {
      propertyType: formData.propertyType,
      listtype: formData.listtype,
      price: Number(formData.price),
      deposit: Number(formData.deposit),
      description: formData.description,
      bedroom: Number(formData.bedroom),
      livingroom: Number(formData.livingroom),
      balcony: formData.balcony ? Number(formData.balcony) : undefined,
      city: formData.city,
      country: formData.country,
      county: formData.county,
      yard: formData.yard,
      landArea: formData.landArea ? Number(formData.landArea) : undefined,
      built: formData.built ? Number(formData.built) : undefined,
      coords: JSON.stringify(formData.location),
    };

    formDataToSend.append("data", JSON.stringify(listingData));

    // Képek hozzáadása
    formData.images.forEach((img) => {
      formDataToSend.append("images", img.file);
    });

    try {
      const response = await appAPI("/upload-listing", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Hiba a feltöltés során");
      
      navigate("/success");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DataInputStep formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return (
          <ImageUploadStep
            images={formData.images}
            mainImage={formData.mainImage}
            handleImageUpload={handleImageUpload}
            setMainImage={setMainImage}
          />
        );
      case 3:
        return (
          <MapStep
            location={formData.location}
            handleMapClick={handleMapClick}
          />
        );
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const DataInputStep = ({ formData, setFormData, errors }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ingatlan típusa</label>
          <select
            value={formData.propertyType}
            onChange={(e) => setFormData(p => ({...p, propertyType: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="House">Ház</option>
            <option value="Apartment">Lakás</option>
            <option value="Room">Szoba</option>
          </select>
          {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hirdetés típusa</label>
          <select
            value={formData.listtype}
            onChange={(e) => setFormData(p => ({...p, listtype: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Rent">Kiadó</option>
            <option value="Sale">Eladó</option>
          </select>
          {errors.listtype && <p className="text-red-500 text-sm mt-1">{errors.listtype}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ár (Ft)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(p => ({...p, price: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kaució (Ft)</label>
          <input
            type="number"
            value={formData.deposit}
            onChange={(e) => setFormData(p => ({...p, deposit: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
          {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Leírás</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
          className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Írd le részletesen az ingatlant..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hálószobák</label>
          <input
            type="number"
            min="1"
            value={formData.bedroom}
            onChange={(e) => setFormData(p => ({...p, bedroom: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nappali</label>
          <input
            type="number"
            min="1"
            value={formData.livingroom}
            onChange={(e) => setFormData(p => ({...p, livingroom: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Erkély (opcionális)</label>
          <input
            type="number"
            min="0"
            value={formData.balcony}
            onChange={(e) => setFormData(p => ({...p, balcony: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Város</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData(p => ({...p, city: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Pl.: Budapest"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Megye</label>
          <input
            type="text"
            value={formData.county}
            onChange={(e) => setFormData(p => ({...p, county: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Pl.: Pest"
          />
          {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kert típusa</label>
          <select
            value={formData.yard}
            onChange={(e) => setFormData(p => ({...p, yard: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Terrace">Terasz</option>
            <option value="Garden">Kert</option>
            <option value="SharedYard">Közös kert</option>
          </select>
          {errors.yard && <p className="text-red-500 text-sm mt-1">{errors.yard}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Teljes terület (m², opcionális)</label>
          <input
            type="number"
            value={formData.landArea}
            onChange={(e) => setFormData(p => ({...p, landArea: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Építés éve (opcionális)</label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.built}
            onChange={(e) => setFormData(p => ({...p, built: e.target.value}))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const ImageUploadStep = ({
    images,
    mainImage,
    handleImageUpload,
    setMainImage,
  }) => {
    const [dragActive, setDragActive] = useState(false);
  
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleImageUpload(Array.from(files));
      }
    };
  
    const handleInputChange = (e) => {
      const files = e.target.files;
      if (files) {
        handleImageUpload(Array.from(files));
      }
    };
  
    return (
      <div className="space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
            accept="image/jpeg, image/png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <p className="text-gray-600">
              Húzd ide a képeket vagy kattints ide a feltöltéshez
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Maximum 10 kép (JPEG, PNG)
            </p>
          </label>
        </div>
  
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={img.name}
              className={`relative group cursor-pointer border-2 ${
                index === mainImage ? "border-blue-500" : "border-gray-200"
              } rounded-lg overflow-hidden transition-all`}
              onClick={() => setMainImage(index)}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-32 object-cover"
              />
              {index === mainImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                  Főképe
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MapStep = ({ location, handleMapClick }) => (
    <div className="h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={location}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={location} />
      </MapContainer>
      <p className="mt-2 text-sm text-gray-600">
        Kattints a térképen a pontos helyszín beállításához
      </p>
    </div>
  );

  const ReviewStep = ({ formData }) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Összegzés</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Alapadatok</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Ingatlan típusa:</span> {formData.propertyType === "House" ? "Ház" : 
              formData.propertyType === "Apartment" ? "Lakás" : "Szoba"}</p>
            <p><span className="font-medium">Hirdetés típusa:</span> {formData.listtype === "Rent" ? "Kiadó" : "Eladó"}</p>
            <p><span className="font-medium">Ár:</span> {Number(formData.price).toLocaleString()} Ft</p>
            <p><span className="font-medium">Kaució:</span> {Number(formData.deposit).toLocaleString()} Ft</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Elhelyezkedés</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Város:</span> {formData.city}</p>
            <p><span className="font-medium">Megye:</span> {formData.county}</p>
            <p><span className="font-medium">Kert típusa:</span> {formData.yard === "Terrace" ? "Terasz" : 
              formData.yard === "Garden" ? "Kert" : "Közös kert"}</p>
            <p><span className="font-medium">Koordináták:</span> {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Térinformációk</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Hálószobák:</span> {formData.bedroom}</p>
            <p><span className="font-medium">Nappali:</span> {formData.livingroom}</p>
            <p><span className="font-medium">Erkélyek:</span> {formData.balcony || "0"}</p>
            {formData.landArea && <p><span className="font-medium">Teljes terület:</span> {formData.landArea} m²</p>}
            {formData.built && <p><span className="font-medium">Építés éve:</span> {formData.built}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Képek</h3>
          <div className="grid grid-cols-2 gap-2">
            {formData.images[formData.mainImage] && (
              <div className="col-span-2">
                <img
                  src={formData.images[formData.mainImage].url}
                  alt="Főkép"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm">Összesen {formData.images.length} kép</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={formData.location}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          dragging={false}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={formData.location} />
        </MapContainer>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full flex flex-row items-center justify-between bg-white px-8 py-4 shadow-sm">
        <div>
          <Link to="/" className="hover:text-gray-700 transition-colors">
            <span className="font-semibold text-gray-600">Mégsem</span>
          </Link>
        </div>

        {/* Lépésjelző */}
        <div className="flex items-center justify-center">
          {[
            { step: 1, title: "Adatok" },
            { step: 2, title: "Képek" },
            { step: 3, title: "Helyszín" },
            { step: 4, title: "Összegzés" },
          ].map(({ step: num, title }, index, arr) => (
            <div key={num} className="flex items-center">
              <button
                onClick={() => goToStep(num)}
                className="flex flex-row items-center gap-3 focus:outline-none"
                disabled={isSubmitting}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    step >= num
                      ? "bg-blue-500 text-white"
                      : "border-2 border-gray-300 text-gray-400"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {step > num ? <IconCheck size={20} /> : num}
                </div>
                <span
                  className={`text-sm font-medium ${
                    step === num ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
              </button>

              {index !== arr.length - 1 && (
                <div className="mx-4">
                  <div className="w-8 h-0.5 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigációs gombok */}
        <div className="flex gap-2">
          <button
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Vissza
          </button>
          <button
            onClick={step === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              step === 4 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-blue-500 hover:bg-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Feldolgozás..." : step === 4 ? "Közzététel" : "Következő"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;