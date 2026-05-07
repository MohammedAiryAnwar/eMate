import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-green-400 to-green-600 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Welcome to <span className="text-green-100">eMate</span> 🛒
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-lg">
            Your smart shopping partner — find everything from daily essentials to electronics at the best prices.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/" className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition-colors shadow-md">
              Shop Now 🚀
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-green-600 transition-colors">
              Join Free
            </Link>
          </div>
        </div>
        <div className="flex-1 text-center text-8xl">
          🛍️
        </div>
      </div>
    </div>
  );
};

export default Hero;
