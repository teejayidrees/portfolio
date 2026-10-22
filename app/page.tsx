import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BlogCarousel from "@/components/sections/BlogCarousel";
import NewsletterModal from "@/components/NewsletterModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Projects before education & experience, per request */}
        <ProjectsSection />
        <Timeline />
        <BlogCarousel />

        <Contact />

        <NewsletterModal />
      </main>
      <Footer />
    </>
  );
}
