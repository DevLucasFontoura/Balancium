import { RelatorioMensalClient } from './RelatorioMensalClient';

export function generateStaticParams() {
  const anos = ['2024', '2025'];
  const meses = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  return anos.flatMap(ano => 
    meses.map(mes => ({
      ano,
      mes,
    }))
  );
}

export default function RelatorioMensal({ 
  params 
}: { 
  params: { ano: string; mes: string } 
}) {
  return (
    <RelatorioMensalClient 
      ano={parseInt(params.ano)} 
      mes={params.mes} 
    />
  );
} 