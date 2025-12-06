import TreeCard from '../components/TreeCard';


const Test = () => {
  // Simulació de dades que vindrien de Supabase
  const dadaArbre = {
    foto: null, // Aquest no té foto -> sortirà la de seguretat
    ubicacio: "Parc de la Ciutadella",
    alcada: "12m",
    tronc: "45cm",
    capcal: "8m"
  };

  return (
    <div style={{ padding: '20px' }}> {/* Un contenidor qualsevol */}
      
      <TreeCard 
        imageSrc={dadaArbre.foto}
        location={dadaArbre.ubicacio}
        height={dadaArbre.alcada}
        trunkWidth={dadaArbre.tronc}
        crownWidth={dadaArbre.capcal}
      />
      
    </div>
  );
}
export default Test;