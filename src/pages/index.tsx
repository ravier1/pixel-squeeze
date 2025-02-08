import Head from "next/head";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("jpeg");
  const [quality, setQuality] = useState<number>(0.8);
  const [targetSize, setTargetSize] = useState<string>("80");
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setOriginalFileName(file.name.replace(/\.[^/.]+$/, "")); // Store filename without extension

    try {
      // Display the original image
      const reader = new FileReader();
      reader.onload = () => setOriginalImage(reader.result as string);
      reader.readAsDataURL(file);

      // Compress the image with adjusted settings
      const options = {
        maxSizeMB: parseInt(targetSize) / 1024, // Convert KB to MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: `image/${outputFormat}`,
        quality: quality,
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
    <>
      <Head>
        <title>PixelSqueeze - Image Compression Tool</title>
        <meta name="description" content="Compress your images easily with PixelSqueeze" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] animate-gradient relative">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <h1 className={`text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] opacity-0 fade-in-up`}>
            Pixel<span className="text-[hsl(280,100%,70%)]">Squeeze</span>
          </h1>
          <div className={`w-full max-w-2xl rounded-xl bg-white/10 p-6 text-white transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageUpload}
                className="w-full rounded-lg bg-white/20 p-2 text-white focus:outline-none"
              />
              <div className="flex gap-4 items-center flex-wrap">
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="rounded-lg bg-white/20 p-2 text-white focus:outline-none"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
                <div className="flex items-center gap-2">
                  <label htmlFor="targetSize">Target Size (KB):</label>
                  <select
                    id="targetSize"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    className="rounded-lg bg-white/20 p-2 text-white focus:outline-none"
                  >
                    <option value="50">50 KB</option>
                    <option value="64">64 KB</option>
                    <option value="80">80 KB</option>
                    <option value="100">100 KB</option>
                    <option value="200">200 KB</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="quality">Quality:</label>
                  <input
                    type="range"
                    id="quality"
                    min="0.5"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span>{Math.round(quality * 100)}%</span>
                </div>
              </div>
            </div>
            {loading && <p className="text-blue-400">Compressing image...</p>}
            {error && <p className="text-red-400">{error}</p>}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {originalImage && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Original Image</h2>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
              {compressedImage && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Compressed Image ({targetSize}KB)</h2>
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full rounded-lg shadow-md"
                  />
                  <a
                    href={compressedImage}
                    download={`compressed-${originalFileName}.${outputFormat}`}
                    className="mt-4 inline-block bg-[hsl(280,100%,70%)] text-white px-4 py-2 rounded-lg hover:bg-[hsl(280,100%,60%)] transition-colors"
                  >
                    Download Compressed Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Creator Badge */}
        <a
          href="https://github.com/raver1"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white hover:bg-white/20 transition-all duration-300 group"
        >
          <div className="relative w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full transform group-hover:rotate-12 transition-transform duration-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
                className="text-pink-500"
              />
            </svg>
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Made with ❤️ by Ravi (@raver1)
          </span>
        </a>
      </main>
    </>
  );
}