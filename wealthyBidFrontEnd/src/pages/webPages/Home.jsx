import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  return (
    <div className="bg-[#ccffcc] min-h-screen text-white overflow-hidden">
      <header className="py-20 text-center">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-yellow-400"
        >
          Welcome to <span className="text-green-700">WealthyBid</span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg text-black"
        >
          The best auction platform to bid on your favorite items
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mt-10 space-x-4"
        >
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="12113"
            className="px-6 py-3 text-white bg-green-600 rounded-full shadow-lg"
          >
            Explore Auctions
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="signup"
            className="px-6 py-3 bg-red-800 rounded-full shadow-lg"
          >
            Register Now
          </motion.a>
        </motion.div>
      </header>
    </div>
  );
};

export default HomePage;
