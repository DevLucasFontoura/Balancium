import { Mensal } from './mensal';

export function generateStaticParams() {
  // Gera os parâmetros para todos os meses do ano
  const meses = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  return meses.map((mes) => ({
    mes: mes,
  }));
}

export default function MensalPage({ params }: { params: { mes: string } }) {
  return <Mensal mes={params.mes} />;
} 