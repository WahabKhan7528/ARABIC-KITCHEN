import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MenuCard from '../ui/MenuCard';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';

gsap.registerPlugin(ScrollTrigger);

// Curation of authentic luxury dishes mapping to 5 core categories
const menuItems = [
  // 1. Grills & Kebabs
  {
    category: "Grills & Kebabs",
    name: "Mixed Royal Grill",
    arabicName: "مشويات مشكلة",
    price: "2,450",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "An opulent assortment of seekh kebabs, malai boti, lamb chops, and beef tikka, charred to smoky perfection."
  },
  {
    category: "Grills & Kebabs",
    name: "Seekh Kabab Arabic Kitchen",
    arabicName: "سيخ كباب",
    price: "1,250",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=600&q=80",
    description: "Minced beef infused with aromatic house coriander, green chilies, onion, and warm charcoal smoked ghee."
  },
  // 2. Arabian Mains
  {
    category: "Arabian Mains",
    name: "Al-Mandi Royal (Lamb)",
    arabicName: "مندي لحم",
    price: "2,850",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80",
    description: "Slow-roasted lamb shoulder served on a bed of long-grain basmati saffron rice, finished with toasted nuts."
  },
  {
    category: "Arabian Mains",
    name: "Royal Mutton Madhbi",
    arabicName: "مضبي لحم",
    price: "2,950",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80",
    description: "Lamb cooked over hot lava stones, seasoned lightly with Hadramout spices, resulting in incredibly tender meat."
  },
  // 3. Mezze & Starters
  {
    category: "Mezze & Starters",
    name: "Hummus Beiruti Platter",
    arabicName: "حمص بيروتي",
    price: "680",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    description: "Silky smooth chickpea purée with fresh garlic, parsley, lemon juice, topped with extra virgin olive oil and pine nuts."
  },
  {
    category: "Mezze & Starters",
    name: "Kibbeh Nabulsieh (3pcs)",
    arabicName: "كبة مقلية",
    price: "790",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    description: "Crispy outer shells of cracked bulgur wheat filled with spiced minced lamb, pine nuts, and sumac."
  },
  // 4. Burgers & Fast Food
  {
    category: "Burgers & Fast Food",
    name: "The Royal Truffle Burger",
    arabicName: "برجر ترافل",
    price: "1,150",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    description: "Juicy wagyu beef blend patty, glazed brioche bun, house black truffle aioli, and mature cheddar melt."
  },
  {
    category: "Burgers & Fast Food",
    name: "Shawarma Wrap Arabic Kitchen",
    arabicName: "شاورما دجاج",
    price: "750",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
    description: "House-marinated chicken breast shavings wrapped in soft saj bread, slathered in authentic toum garlic paste."
  },
  // 5. Desserts & Drinks
  {
    category: "Desserts & Drinks",
    name: "Kunafa Al-Sultani",
    arabicName: "كنافة سلطانية",
    price: "1,100",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    description: "Crispy shredded kataifi pastry, layered with warm melted sweet akkawi cheese, soaked in orange-blossom syrup."
  },
  {
    category: "Desserts & Drinks",
    name: "Royal Mint Margarita",
    arabicName: "مارجريتا النعناع",
    price: "420",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    description: "Refreshing crushed ice drink with muddled garden mint leaves, fresh lime zest, and mineral seltzer."
  }
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const categories = ["All", "Grills & Kebabs", "Arabian Mains", "Mezze & Starters", "Burgers & Fast Food", "Desserts & Drinks"];

  // Filter items dynamically based on category selector
  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Helper to repeat items so the sliding marquee is always seamless and wider than the screen
  const getMarqueeItems = (items) => {
    if (items.length === 0) return [];
    let repeated = [...items];
    while (repeated.length < 8) {
      repeated = [...repeated, ...items];
    }
    return [...repeated, ...repeated];
  };

  const marqueeItems = getMarqueeItems(filteredItems);

  // Auto-scrolling infinite animation frame loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset scroll positions cleanly on category changes
    container.scrollLeft = 0;

    let animationFrameId;
    const speed = 0.8; // Elegant slow auto-scrolling speed (pixels per frame)

    const animate = () => {
      if (!isHoveredRef.current && !isDraggingRef.current) {
        container.scrollLeft += speed;

        const maxScroll = container.scrollWidth;
        const halfScroll = maxScroll / 2;

        // Infinite forward wrap
        if (container.scrollLeft >= halfScroll) {
          container.scrollLeft -= halfScroll;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeCategory]);

  // Seamless horizontal wrapping scroll listener
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth;
    const halfScroll = maxScroll / 2;

    if (container.scrollLeft >= halfScroll) {
      container.scrollLeft -= halfScroll;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft += halfScroll;
    }
  };

  // Mouse Grab to Drag Scrolling Handlers
  const handleMouseDown = (e) => {
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    container.style.cursor = 'grabbing';
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Sensitivity multiplier
    container.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    const container = containerRef.current;
    if (container) {
      container.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Elegant scroll triggered fade-in entrance for the section header
      gsap.fromTo(section.querySelectorAll('.animate-on-scroll'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative min-h-screen text-ivory py-16 md:py-24 flex flex-col justify-center select-none overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #281005 0%, #0F0500 100%)',
      }}
    >
      {/* Background elegant watermark */}
      <KhatamPattern opacity={0.05} color="#C9952A" />

      {/* Header Block */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full text-center mb-6 relative z-20 flex flex-col items-center">
        <span className="animate-on-scroll font-arabic text-[#C9952A] text-base tracking-[0.2em] mb-1 block">
          قائمة الطعام
        </span>
        <h2 className="animate-on-scroll font-display italic text-4xl md:text-5xl text-ivory mb-2 tracking-tight">
          Featured Menu
        </h2>
        <div className="animate-on-scroll">
          <MuqarnasArch color="#C9952A" size={60} />
        </div>

        {/* Categories Tab selectors */}
        <div className="animate-on-scroll flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-6 max-w-4xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] md:text-xs uppercase font-body font-semibold tracking-wider transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[#C9952A] text-[#1A0A00] border-[#C9952A] shadow-[0_0_15px_rgba(201,149,42,0.25)]"
                  : "bg-transparent text-cream/70 border-cream/20 hover:border-cream/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Scroll Container */}
      {/* Desktop (Infinite Grab-to-Drag Automatic Marquee) */}
      <div className="hidden lg:block w-full overflow-hidden mt-4 py-4 relative z-20 animate-fade-in">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            handleMouseUpOrLeave();
          }}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onDragStart={(e) => e.preventDefault()}
          className="flex w-full overflow-x-auto scrollbar-none gap-8 pl-12 pr-12 select-none cursor-grab active:cursor-grabbing transform-gpu"
        >
          {marqueeItems.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="menu-card-wrapper shrink-0">
              <MenuCard {...item} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / Tablet (Vertical Grid Container) */}
      <div className="lg:hidden w-full px-6 mt-4 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center max-w-4xl mx-auto">
          {filteredItems.map((item, idx) => (
            <MenuCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
