// Footer component

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
            <p className="text-gray-400">
              Platform berita teknologi dan edukasi terpadu untuk pembelajaran
              modern.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Data Science
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cybersecurity
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Dapatkan artikel terbaru di inbox Anda
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <p className="text-gray-400">
            © {currentYear} Tech & Education News. Semua hak dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
