import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import OandaSupportChat from "./CustomerService";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />    
      <Footer />
      <OandaSupportChat />
      
    </div>
  );
};

export default Index;
