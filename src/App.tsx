/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Menu } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  {id:1, name:"Gold Ring", price:2999, img:"https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=600&q=80"},
  {id:2, name:"Necklace", price:4999, img:"https://images.unsplash.com/photo-1588444650700-6d0e7f1c9b2a?auto=format&fit=crop&w=600&q=80"},
  {id:3, name:"Earrings", price:1999, img:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"},
  {id:4, name:"Bracelet", price:2599, img:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80"}
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("suzumi_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("suzumi_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCheckout = () => {
    alert(`Order placed! Total ₹${cartTotal}`);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleWhatsApp = () => {
    let msg = "Hello SUZUMI, I want to order:\n";
    cart.forEach(i => msg += `${i.name} x${i.qty} - ₹${i.price * i.qty}\n`);
    msg += `\nTotal: ₹${cartTotal}`;
    window.open(`https://wa.me/917899442679?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text bg-brand-bg">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-40 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="font-serif text-2xl tracking-[0.2em] font-bold">SUZUMI</div>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><a href="#" className="text-sm uppercase tracking-wider hover:text-gold transition-colors">Home</a></li>
          <li><a href="#shop" className="text-sm uppercase tracking-wider hover:text-gold transition-colors">Collection</a></li>
          <li><a href="#about" className="text-sm uppercase tracking-wider hover:text-gold transition-colors">About</a></li>
          <li><a href="#contact" className="text-sm uppercase tracking-wider hover:text-gold transition-colors">Contact</a></li>
        </ul>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:text-gold transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-white pt-24 px-6">
          <button 
            className="absolute top-6 right-6 p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <ul className="flex flex-col gap-6 text-xl text-center">
            <li><a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-gold">Home</a></li>
            <li><a href="#shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-gold">Collection</a></li>
            <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-gold">About</a></li>
            <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-gold">Contact</a></li>
          </ul>
        </div>
      )}

      {/* Hero */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-white text-center px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80" 
            alt="Jewellery Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-wide">SUZUMI</h1>
          <p className="text-lg md:text-xl mb-8 font-light tracking-widest uppercase">Elegance in Every Detail</p>
          <a href="#shop" className="inline-block bg-gold hover:bg-gold/90 text-white px-8 py-3 uppercase tracking-wider text-sm transition-colors">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl mb-4">Our Collection</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-8"></div>
          
          <div className="max-w-md mx-auto relative">
            <input 
              type="text" 
              placeholder="Search collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:border-gold transition-colors bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No products found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-white p-4 transition-transform duration-300 hover:-translate-y-2 shadow-sm hover:shadow-md">
                <div className="aspect-square overflow-hidden mb-4 relative">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-white text-brand-text px-6 py-2 uppercase text-xs tracking-wider font-medium hover:bg-gold hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <p className="text-gold font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-6">About SUZUMI</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            SUZUMI is a luxury jewellery brand blending elegance and timeless beauty into every piece. 
            Our master artisans craft each design with meticulous attention to detail, using only the 
            finest materials to create heirlooms that will be cherished for generations.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 text-center">
        <h2 className="font-serif text-4xl mb-6">Contact Us</h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-8"></div>
        <p className="text-xl mb-8 font-light">📞 +91 7899442679</p>
        <button 
          onClick={handleWhatsApp}
          className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 uppercase tracking-wider text-sm transition-colors inline-flex items-center gap-2"
        >
          Chat on WhatsApp
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white/70 text-center py-12 px-6 mt-auto">
        <div className="font-serif text-2xl tracking-[0.2em] text-white mb-6">SUZUMI</div>
        <p className="text-sm font-light">© {new Date().getFullYear()} SUZUMI Jewellery. All rights reserved.</p>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:text-gold transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
              <p>Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 text-gold hover:underline uppercase text-sm tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                  <img src={item.img} alt={item.name} className="w-20 h-20 object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 hover:bg-gray-50">-</button>
                        <span className="px-3 py-1 text-sm border-x border-gray-200">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 hover:bg-gray-50">+</button>
                      </div>
                      <p className="text-gold font-medium">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg uppercase tracking-wider text-gray-600">Total</span>
              <span className="font-serif text-2xl">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckout}
                className="w-full bg-brand-text text-white py-4 uppercase tracking-wider text-sm hover:bg-black transition-colors"
              >
                Checkout
              </button>
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 uppercase tracking-wider text-sm hover:bg-[#128C7E] transition-colors"
              >
                Order via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
