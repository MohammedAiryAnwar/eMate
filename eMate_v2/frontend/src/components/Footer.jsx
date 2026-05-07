const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xl font-bold mb-2">🛒 eMate</p>
        <p className="text-green-200 text-sm mb-4">Your Smart Shopping Partner</p>
        <div className="flex justify-center gap-6 text-green-200 text-sm mb-4">
          <span>Daily Use</span>
          <span>Books</span>
          <span>Stationary</span>
          <span>Electronics</span>
        </div>
        <p className="text-green-300 text-xs">© 2024 eMate. Built with ❤️ by Airy</p>
      </div>
    </footer>
  );
};

export default Footer;
