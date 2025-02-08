import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageCompressor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Display the original image
      const reader = new FileReader();
      reader.onload = () => setOriginalImage(reader.result as string);
      reader.readAsDataURL(file);

      // Compress the image to 64KB
      const options = {
        maxSizeMB: 0.064, // 64KB in MB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const compressedReader = new FileReader();
      compressedReader.onload = () => setCompressedImage(compressedReader.result as string);
      compressedReader.readAsDataURL(compressedFile);
    } catch (err) {
      setError("Failed to compress the image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Image Compressor</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {loading && <p className="text-blue-500">Compressing image...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {originalImage && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Original Image</h2>
                <img src={originalImage} alt="Original" className="w-full rounded-lg" />
              </div>
            )}
            {compressedImage && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Compressed Image (64KB)</h2>
                <img src={compressedImage} alt="Compressed" className="w-full rounded-lg" />
                <a
                  href={compressedImage}
                  download="compressed-image.jpg"
                  className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Download Compressed Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;