import Logo from "@/assets/TEPAY.png";
function TepayLogo({ className }: { className?: string }) {
  return (
    <img src={Logo} alt="Tepay-Logo" className={`aspect-square ${className}`} />
  );
}

export default TepayLogo;
