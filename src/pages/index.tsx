import Head from "next/head";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";

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
  const [mode, setMode] = useState<'compress' | 'convert'>('compress');
  const [inputFormat, setInputFormat] = useState<string>('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setOriginalFileName(file.name.replace(/\.[^/.]+$/, ""));
    
    // Get input format from file type
    const detectedFormat = file.type.split('/')[1] || 'unknown';
    setInputFormat(detectedFormat);

    try {
      // Display the original image
      const reader = new FileReader();
      reader.onload = () => setOriginalImage(reader.result as string);
      reader.readAsDataURL(file);

      const options = {
        maxSizeMB: mode === 'compress' ? parseInt(targetSize) / 1024 : 100, // High value for conversion-only
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: `image/${outputFormat}`,
        quality: mode === 'compress' ? quality : 1.0, // Full quality for conversion-only
      };

      const processedFile = await imageCompression(file, options);
      const processedReader = new FileReader();
      processedReader.onload = () => setCompressedImage(processedReader.result as string);
      processedReader.readAsDataURL(processedFile);
    } catch (err) {
      setError("Failed to process the image. Please try again.");
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
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="group flex items-center justify-center gap-2 w-full p-6 text-white border-2 border-dashed border-white/40 rounded-xl cursor-pointer hover:border-[hsl(280,100%,70%)] hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-medium">
                      Drop your image here or <span className="text-[hsl(280,100%,70%)]">browse</span>
                    </span>
                    <span className="text-sm text-white/60">Supports all image formats</span>
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-4 items-center p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4 w-full mb-4">
                  <div className="flex gap-4 p-2 bg-white/10 rounded-lg">
                    <label className="relative flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="mode"
                        value="convert"
                        checked={mode === 'convert'}
                        onChange={(e) => setMode(e.target.value as 'convert' | 'compress')}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`
                        px-4 py-2 rounded-lg transition-all duration-300
                        ${mode === 'convert' 
                          ? 'bg-[hsl(280,100%,70%)] text-white' 
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }
                      `}>
                        🔄 Convert Only
                      </div>
                    </label>
                    <label className="relative flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="mode"
                        value="compress"
                        checked={mode === 'compress'}
                        onChange={(e) => setMode(e.target.value as 'convert' | 'compress')}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`
                        px-4 py-2 rounded-lg transition-all duration-300
                        ${mode === 'compress' 
                          ? 'bg-[hsl(280,100%,70%)] text-white' 
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }
                      `}>
                        🗜️ Compress & Convert
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">Output Format:</span>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="rounded-lg bg-white/20 p-2 text-white focus:outline-none hover:bg-white/30 transition-colors"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                      <option value="gif">GIF</option>
                      <option value="bmp">BMP</option>
                    </select>
                  </div>

                  <AnimatePresence>
                    {mode === 'compress' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-wrap items-center gap-4 w-full"
                      >
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 shadow-lg">
                          <label htmlFor="targetSize" className="text-white font-medium">Target Size:</label>
                          <select
                            id="targetSize"
                            value={targetSize}
                            onChange={(e) => setTargetSize(e.target.value)}
                            className="bg-white/10 text-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)] transition-all"
                          >
                            <option value="50">50 KB</option>
                            <option value="64">64 KB</option>
                            <option value="80">80 KB</option>
                            <option value="100">100 KB</option>
                            <option value="200">200 KB</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10 shadow-lg">
                          <label htmlFor="quality" className="text-white font-medium whitespace-nowrap">Quality:</label>
                          <input
                            type="range"
                            id="quality"
                            min="0.5"
                            max="1"
                            step="0.1"
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-32 accent-[hsl(280,100%,70%)]"
                          />
                          <span className="text-white font-medium min-w-[4ch] text-center">
                            {Math.round(quality * 100)}%
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          href="https://github.com/ravier1"
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
            Made with ❤️ by Ravi (@ravier1)
          </span>
        </a>
      </main>
    </>
  );
}