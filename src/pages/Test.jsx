import TreeCard from '../components/TreeCard';
import imatge from '../assets/FotosArbres/Avet de Canejan_2.png';


const Test = () => {
  // Simulació de dades que vindrien de Supabase
  const dadaArbre = {
    id: 45,
    nom: "Avet de Canejan",
    colorTitol: "blau",

    //FOTO: seguretat, src i internet. Ho admet tot.
    // foto: null, // Aquest no té foto -> sortirà la de seguretat
    foto: imatge, // Aquest no té foto -> sortirà la de seguretat
    //foto: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80",
    
    municipi: "Canejan",
    comarca: "Vall d'Aran",
    alcada: "12",
    tronc: "45",
    capcal: "8"
  };

  return (
    <div style={{ padding: '0px' }}> {/* Un contenidor qualsevol */}
      
      <TreeCard 
        id={dadaArbre.id}
        name={dadaArbre.nom}
        titleColor={dadaArbre.colorTitol}
        imageSrc={dadaArbre.foto}
        municipality={dadaArbre.municipi}
        comarca={dadaArbre.comarca}
        height={dadaArbre.alcada}
        trunkWidth={dadaArbre.tronc}
        crownWidth={dadaArbre.capcal}
      />
      
    </div>
  );
}
export default Test;