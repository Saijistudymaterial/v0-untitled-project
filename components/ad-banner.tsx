import Script from "next/script"

interface AdBannerProps {
  position: "top" | "middle" | "bottom" | "sidebar"
}

export function AdBanner({ position }: AdBannerProps) {
  // Different styles based on position
  const getAdContainerClass = () => {
    switch (position) {
      case "top":
      case "bottom":
        return "w-full h-[90px] md:h-[120px] mb-8"
      case "middle":
        return "w-full h-[250px] mb-8"
      case "sidebar":
        return "w-full h-[600px]"
      default:
        return "w-full h-[90px]"
    }
  }

  return (
    <div
      className={`${getAdContainerClass()} bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden`}
    >
      <div className="text-gray-400 text-sm absolute">Advertisement</div>
      <div id={`ad-container-${position}`} className="w-full h-full">
        {/* Google AdSense Ad will be inserted here */}
      </div>

      {/* Google AdSense Script */}
      <Script id="google-adsense" strategy="afterInteractive">
        {`
          (function() {
            if (typeof window !== 'undefined') {
              if (!window.adsbygoogle) {
                const script = document.createElement('script');
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6388125087297945';
                script.async = true;
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              }
              
              window.adsbygoogle = window.adsbygoogle || [];
              window.adsbygoogle.push({});
            }
          })();
        `}
      </Script>
    </div>
  )
}
