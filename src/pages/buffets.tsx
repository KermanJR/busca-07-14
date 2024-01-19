
import Footer from "@src/app/components/site/Patterns/Footer/Footer";
import Header from "@src/app/components/site/Patterns/Header/Header";
import SinglePageBuffet from "@src/app/content/site/screens/SinglePageBuffet";
import { useRouter } from 'next/router';
import  { GetStaticPaths, GetStaticProps} from 'next';
import BuffetService from "@src/app/api/BuffetService";
import next  from "next";


export default function Buffet(){
  const router = useRouter();
  const { buffetSlug } = router.query;
  

    return(
      <><Header/>
        <SinglePageBuffet slug={buffetSlug}/>
        <Footer/>
      </>
    )
}

/*export const getStaticPaths: GetStaticPaths = async () => {
  // Aqui você deve buscar todos os slugs de buffets do seu banco de dados
  // e retornar um array de objetos no formato { params: { buffetSlug: 'slug' } }
  const slugs = await BuffetService.showBuffets();
  const paths = slugs.map(slug => ({
    params: { buffetSlug: slug?.slug }
  }));


  return {
    paths,
    fallback: true, // ou true se desejar gerar páginas sob demanda
  };
};


export const getStaticProps: GetStaticProps = async ({ params }) => {

  console.log("Parâmetros: " + params)
  const buffetSlug: any = params?.buffetSlug || '';
  console.log(buffetSlug)
  const buffetData = await BuffetService.showBuffetsBySlug(buffetSlug).then(res=>res);
  console.log(buffetData)


  return {
    props: {
      buffetData,
      // Outros dados necessários para a renderização da página
    },
  };
};*/

