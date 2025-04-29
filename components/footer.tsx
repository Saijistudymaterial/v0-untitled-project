import { Github, Twitter, Facebook, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">File Converter</h3>
            <p className="text-gray-400 mb-4">The ultimate tool for all your file conversion needs.</p>
            <p className="text-gray-400">
              Created by <span className="font-semibold">Rahul Numberdar</span>
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Image Editor
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  PDF Merger
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
            <p className="text-gray-400">Subscribe to our newsletter for updates</p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white px-3 py-2 rounded-l-md w-full focus:outline-none"
              />
              <button className="bg-purple-600 px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} File Converter by Rahul Numberdar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
