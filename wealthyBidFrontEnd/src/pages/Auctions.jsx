import { useState, useEffect } from "react";
import { motion } from "framer-motion";
//import axios from "axios";

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    endTime: "",
  });
  const [images, setImages] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);

  // Fetch Auctions from the backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("/api/auctions");
        setAuctions(response.data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  // Handle image input changes and generate previews
  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file); // Create a preview URL for the image

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    updatedImages[index] = null;
    updatedPreviews[index] = null;

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // Handle form submission to create a new auction
  const handleAddAuction = async () => {
    if (!newAuction.title || !newAuction.description || !newAuction.endTime) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", newAuction.title);
    formData.append("description", newAuction.description);
    formData.append("endTime", newAuction.endTime);

    images.forEach((image, index) => {
      if (image) {
        formData.append(`image${index + 1}`, image);
      }
    });

    try {
      const response = await axios.post("/api/auctions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAuctions([...auctions, response.data]);
      setNewAuction({ title: "", description: "", endTime: "" });
      setImages([null, null, null]);
      setImagePreviews([null, null, null]);
    } catch (error) {
      console.error("Error adding auction:", error);
    }
  };

  const handleRemoveAuction = async (id) => {
    try {
      await axios.delete(`/api/auctions/${id}`);
      setAuctions(auctions.filter((auction) => auction.id !== id));
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  // Animation Variants for Auction Cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <motion.h1
        className="text-4xl font-bold text-center text-[#000435] mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Manage Auctions
      </motion.h1>

      {/* Auction Form */}
      <motion.div
        className="bg-white shadow-lg p-6 rounded-lg mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#000435]">
          Add New Auction
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Auction Title"
            value={newAuction.title}
            onChange={(e) =>
              setNewAuction({ ...newAuction, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000435]"
          />
          <textarea
            placeholder="Auction Description"
            value={newAuction.description}
            onChange={(e) =>
              setNewAuction({ ...newAuction, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000435]"
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={newAuction.endTime}
            onChange={(e) =>
              setNewAuction({ ...newAuction, endTime: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000435]"
          />

          {/* Image Uploads */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#000435]">
              Upload Images:
            </h3>
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative">
                <label
                  htmlFor={`file-input-${index}`}
                  className="block cursor-pointer"
                >
                  <motion.input
                    type="file"
                    id={`file-input-${index}`}
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="sr-only"
                  />
                  <motion.div
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-[#000435] text-white text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose File {index + 1}
                  </motion.div>
                </label>

                {/* Image Preview */}
                {imagePreviews[index] && (
                  <motion.div
                    className="mt-2 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={imagePreviews[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    {/* Remove Button */}
                    <motion.button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                    >
                      X
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <motion.button
            onClick={handleAddAuction}
            className="px-4 py-2 bg-[#000435] text-white font-semibold rounded-md shadow hover:bg-[#000335] focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Auction
          </motion.button>
        </div>
      </motion.div>

      {/* Auction List */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <motion.div
              key={auction.id}
              className="bg-white shadow-md rounded-lg p-4 relative"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-bold text-[#000435] mb-2">
                {auction.title}
              </h3>
              <p className="text-gray-600 mb-2">{auction.description}</p>
              <p className="text-sm text-gray-500">
                Ends on: {new Date(auction.endTime).toLocaleString()}
              </p>

              {/* Display Images */}
              <div className="flex space-x-2 mt-2">
                {auction.images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={`Auction ${index}`}
                    className="w-1/3 h-16 object-cover rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>

              {/* Remove Button */}
              <motion.button
                onClick={() => handleRemoveAuction(auction.id)}
                className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1"
                whileHover={{ scale: 1.1, rotate: 90 }}
              >
                X
              </motion.button>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No auctions available.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AuctionPage;
